import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { getProfile, updateProfile, completeOnboarding } from "@/api/profile";
import type { Profile } from "@/types";

export function useProfile() {
  const { user, setProfile } = useAuthStore();
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getProfile(user!.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<Profile>) => updateProfile(user!.id, updates),
    onSuccess: (updated) => {
      queryClient.setQueryData(["profile", user?.id], updated);
      setProfile(updated);
    },
  });

  const onboardingMutation = useMutation({
    mutationFn: (data: Partial<Profile>) => completeOnboarding(user!.id, data),
    onSuccess: (updated) => {
      console.log(updated);
      queryClient.setQueryData(["profile", user?.id], updated);
      setProfile(updated);
    },
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,
    updateProfile: updateMutation.mutateAsync,
    completeOnboarding: onboardingMutation.mutateAsync,
    isUpdating: updateMutation.isPending || onboardingMutation.isPending,
  };
}
