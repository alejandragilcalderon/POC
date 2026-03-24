import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { AppColors } from "@/shared/ui/theme/colors";

type Props = {
  children: ReactNode;
  /** @default 48 */
  paddingTop?: number;
};

export function ScreenSurface({ children, paddingTop = 48 }: Props) {
  return <View style={[styles.root, { paddingTop }]}>{children}</View>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
});
