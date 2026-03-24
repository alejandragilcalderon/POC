import { StyleSheet, Text, View } from "react-native";
import { AppColors } from "@/shared/ui/theme/colors";

type Props = {
  title?: string;
  message: string;
};

/**
 * Prominent, readable error block (not a single raw status line).
 */
export function FriendlyErrorBanner({ title = "Something went wrong", message }: Props) {
  return (
    <View style={styles.wrap} accessibilityRole="alert">
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: AppColors.error,
    backgroundColor: "rgba(255, 139, 139, 0.12)",
  },
  title: {
    color: AppColors.textPrimary,
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 6,
  },
  body: {
    color: AppColors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
});
