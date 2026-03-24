import { ScrollView, StyleSheet, View } from "react-native";
import type { ApodPayload } from "@/modules/apod/domain/entities/apod-entry";
import { ApodCard } from "@/modules/apod/presentation/components/apod-card";

type Props = {
  data: ApodPayload;
};

export function ApodFeedWidget({ data }: Props) {
  return (
    <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
      {Array.isArray(data) ? (
        data.map((item) => (
          <View key={`${item.date}-${item.title}`} style={styles.cardSlot}>
            <ApodCard entry={item} />
          </View>
        ))
      ) : (
        <ApodCard entry={data} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, marginTop: 16 },
  listContent: { paddingBottom: 32 },
  cardSlot: { marginBottom: 16 },
});
