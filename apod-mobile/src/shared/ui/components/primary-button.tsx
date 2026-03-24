import { Pressable, StyleSheet, Text } from "react-native";
import { AppColors } from "@/shared/ui/theme/colors";

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function PrimaryButton({ label, onPress, disabled }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    marginHorizontal: 16,
    backgroundColor: AppColors.accent,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { opacity: 0.88 },
  disabled: { opacity: 0.45 },
  label: { color: AppColors.textPrimary, fontWeight: "700" },
});
