import { Image, StyleSheet, View } from "react-native";
import { AppColors } from "@/shared/ui/theme/colors";

type Props = {
  uri: string | undefined;
};

export function ApodMediaPreview({ uri }: Props) {
  if (!uri) return null;

  return (
    <View style={styles.wrap}>
      <Image source={{ uri }} style={styles.image} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: "100%" },
  image: {
    width: "100%",
    height: 220,
    backgroundColor: AppColors.imagePlaceholder,
  },
});
