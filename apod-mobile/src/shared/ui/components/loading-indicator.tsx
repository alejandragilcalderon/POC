import { ActivityIndicator, StyleSheet, View } from "react-native";
import { AppColors } from "@/shared/ui/theme/colors";

type Props = {
  /** @default 'large' */
  size?: "small" | "large";
};

export function LoadingIndicator({ size = "large" }: Props) {
  return (
    <View style={styles.wrap} accessibilityRole="progressbar" accessibilityLabel="Loading">
      <ActivityIndicator size={size} color={AppColors.accentSoft} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 24, alignItems: "center", justifyContent: "center" },
});
