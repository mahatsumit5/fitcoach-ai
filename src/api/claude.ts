import { supabase } from "@/lib/supabase";

type ClaudeMessage = {
  role: "user" | "assistant";
  content: string;
};

type ClaudeRequestOptions = {
  messages: ClaudeMessage[];
  system?: string;
  max_tokens?: number;
};

async function getAuthToken(): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error("Not authenticated");
  return session.access_token;
}

export async function callClaude(
  options: ClaudeRequestOptions,
): Promise<string> {
  const token = await getAuthToken();
  const url = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/claude-proxy`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(options),
  });
  console.log(response);
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claude API error ${response.status}: ${err}`);
  }

  const data = await response.json();

  // Extract text from Anthropic response format
  const text =
    data.content
      ?.filter((block: any) => block.type === "text")
      ?.map((block: any) => block.text as string)
      ?.join("") ?? "";

  if (!text) throw new Error("Empty response from Claude");
  return text;
}

/** Call Claude and parse the response as JSON. Throws if parsing fails. */
export async function callClaudeJSON<T>(
  options: ClaudeRequestOptions,
): Promise<T> {
  const text = await callClaude(options);

  // Strip any accidental markdown fences
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new Error(
      `Failed to parse Claude JSON response: ${cleaned.slice(0, 200)}`,
    );
  }
}

/** Save a message pair to the ai_messages table */
export async function saveAiMessage({
  profileId,
  role,
  content,
  contextType,
}: {
  profileId: string;
  role: "user" | "assistant";
  content: string;
  contextType?: string;
}) {
  await supabase.from("ai_messages").insert({
    profile_id: profileId,
    role,
    content,
    context_type: contextType ?? "general",
  });
}

/** Load recent message history for context */
export async function loadMessageHistory(profileId: string, limit = 20) {
  const { data } = await supabase
    .from("ai_messages")
    .select("role, content")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []).reverse() as {
    role: "user" | "assistant";
    content: string;
  }[];
}
