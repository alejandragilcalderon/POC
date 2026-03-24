import { Stack } from "expo-router";
import { AppColors } from "@/shared/ui/theme/colors";

const screenOptions = {
  headerShown: false as const,
  headerStyle: { backgroundColor: AppColors.background },
  headerTintColor: AppColors.textPrimary,
  contentStyle: { backgroundColor: AppColors.background },
};

/**
 * Global navigation chrome — keeps stack styling out of `app/_layout.tsx`.
 */
export function RootStackWidget() {
  return <Stack screenOptions={screenOptions} />;
}
