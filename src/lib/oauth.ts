import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import * as AppleAuthentication from "expo-apple-authentication";
import { Platform } from "react-native";
import { supabase } from "@/lib/supabase";

// Required for OAuth redirect to work on Android
WebBrowser.maybeCompleteAuthSession();

// ─── Google OAuth ─────────────────────────────────────────────────────────────

export async function signInWithGoogle(): Promise<void> {
  const redirectUrl = AuthSession.makeRedirectUri({
    scheme:   "fitcoachai",
    path:     "auth/callback",
  });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo:        redirectUrl,
      skipBrowserRedirect: true,
    },
  });

  if (error) throw error;
  if (!data.url) throw new Error("No OAuth URL returned");

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

  if (result.type === "success" && result.url) {
    const url      = new URL(result.url);
    const fragment = new URLSearchParams(url.hash.slice(1)); // strip #
    const query    = new URLSearchParams(url.search);

    const accessToken  = fragment.get("access_token")  ?? query.get("access_token");
    const refreshToken = fragment.get("refresh_token") ?? query.get("refresh_token");

    if (accessToken && refreshToken) {
      const { error: sessionError } = await supabase.auth.setSession({
        access_token:  accessToken,
        refresh_token: refreshToken,
      });
      if (sessionError) throw sessionError;
    }
  }
}

// ─── Apple OAuth ──────────────────────────────────────────────────────────────

export async function signInWithApple(): Promise<void> {
  if (Platform.OS !== "ios") {
    throw new Error("Apple Sign In is only available on iOS");
  }

  // Check if Apple Authentication is available on this device
  const isAvailable = await AppleAuthentication.isAvailableAsync();
  if (!isAvailable) {
    throw new Error("Apple Sign In is not available on this device");
  }

  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });

  if (!credential.identityToken) {
    throw new Error("No identity token returned from Apple");
  }

  const { error } = await supabase.auth.signInWithIdToken({
    provider: "apple",
    token:    credential.identityToken,
  });

  if (error) throw error;
}
