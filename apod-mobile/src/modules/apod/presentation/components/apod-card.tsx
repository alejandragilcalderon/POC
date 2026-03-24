import { StyleSheet, View } from "react-native";
import type { ApodEntry } from "@/modules/apod/domain/entities/apod-entry";
import { ApodCardBody } from "@/modules/apod/presentation/components/apod-card-body";
import { ApodMediaPreview } from "@/modules/apod/presentation/components/apod-media-preview";
import { spacing } from "@/shared/resources";
import { AppColors } from "@/shared/ui/theme/colors";

type Props = { entry: ApodEntry };

function resolvePreviewUri(entry: ApodEntry): string | undefined {
  if (entry.mediaType === "video") {
    return entry.thumbnailUrl ?? entry.url;
  }
  return entry.url;
}

/**
 * Composed card — delegates to media + body components.
 */
export function ApodCard({ entry }: Props) {
  const uri = resolvePreviewUri(entry);

  return (
    <View style={styles.card}>
      <ApodMediaPreview uri={uri} />
      <ApodCardBody entry={entry} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.surface,
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: spacing.screenPaddingX,
  },
});
