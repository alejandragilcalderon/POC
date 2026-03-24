import { StyleSheet, Text, View } from "react-native";
import type { ApodEntry } from "@/modules/apod/domain/entities/apod-entry";
import { AppColors } from "@/shared/ui/theme/colors";

type Props = {
  entry: ApodEntry;
};

export function ApodCardBody({ entry }: Props) {
  return (
    <View style={styles.block}>
      <Text style={styles.title}>{entry.title}</Text>
      <Text style={styles.meta}>{entry.date}</Text>
      {entry.copyright ? (
        <Text style={styles.copy} accessibilityLabel={`Copyright ${entry.copyright}`}>
          © {entry.copyright}
        </Text>
      ) : null}
      <Text style={styles.body}>{entry.explanation}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { padding: 16, paddingTop: 12 },
  title: { fontSize: 20, fontWeight: "700", marginTop: 12, color: AppColors.textPrimary },
  meta: { opacity: 0.6, marginTop: 4, color: AppColors.textPrimary },
  copy: { opacity: 0.7, marginTop: 8, fontSize: 12, color: AppColors.textPrimary },
  body: { marginTop: 12, lineHeight: 22, fontSize: 15, color: AppColors.textPrimary },
});
