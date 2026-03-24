import { StyleSheet, Text, View } from "react-native";
import { AppColors } from "@/shared/ui/theme/colors";

type Props = {
  title?: string;
};

export function ApodHomeToolbarWidget({ title = "NASA APOD" }: Props) {
  return (
    <View style={styles.toolbar}>
      <Text style={styles.brand} accessibilityRole="header">
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  brand: { color: AppColors.textPrimary, fontSize: 18, fontWeight: "700" },
});
