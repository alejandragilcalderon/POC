import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { InsightWeatherPayload } from "@/modules/insight-weather/domain/entities/insight-weather-payload";
import type { InsightWeatherFailure } from "@/modules/insight-weather/domain/ports/insight-weather-repository.port";
import { SolWeatherCard } from "@/modules/insight-weather/presentation/components/sol-weather-card";
import { extractSolReadings } from "@/modules/insight-weather/presentation/utils/extract-sol-readings";
import { FriendlyErrorBanner } from "@/shared/ui/components/friendly-error-banner";
import {
  formatUpstreamMessage,
  friendlyNetworkMessage,
} from "@/shared/ui/utils/format-api-error";
import { spacing, strings } from "@/shared/resources";
import { AppColors } from "@/shared/ui/theme/colors";

type Props = {
  state:
    | { status: "idle" }
    | { status: "loading"; previousData?: InsightWeatherPayload }
    | { status: "success"; data: InsightWeatherPayload }
    | { status: "error"; error: InsightWeatherFailure };
  onRefresh: () => void;
  refreshing: boolean;
};

function mapFailure(error: InsightWeatherFailure): { title: string; message: string } {
  switch (error.kind) {
    case "network":
      return {
        title: strings.errors.networkTitle,
        message: friendlyNetworkMessage(error.message),
      };
    case "upstream":
      return {
        title: strings.errors.insightUpstreamTitle,
        message: formatUpstreamMessage(error.status, error.message),
      };
  }
}

function resolvePayload(
  state: Props["state"]
): { payload: InsightWeatherPayload | null; showInitialSpinner: boolean } {
  if (state.status === "success") {
    return { payload: state.data, showInitialSpinner: false };
  }
  if (state.status === "loading") {
    if (state.previousData) {
      return { payload: state.previousData, showInitialSpinner: false };
    }
    return { payload: null, showInitialSpinner: true };
  }
  return { payload: null, showInitialSpinner: false };
}

export function InsightWeatherWidget({ state, onRefresh, refreshing }: Props) {
  const { payload, showInitialSpinner } = resolvePayload(state);
  const readings = payload ? extractSolReadings(payload) : [];

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={AppColors.accentSoft} />
      }
      accessibilityLabel="InSight Mars weather section"
    >
      <Text style={styles.hint}>{strings.insightWeather.widgetHint}</Text>

      {showInitialSpinner ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={AppColors.accentSoft} size="large" />
        </View>
      ) : null}

      {readings.length > 0
        ? readings.map((r) => <SolWeatherCard key={r.sol} reading={r} />)
        : null}

      {payload && readings.length === 0 && !showInitialSpinner ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>{strings.insightWeather.emptyTitle}</Text>
          <Text style={styles.emptyBody}>{strings.insightWeather.emptyBody}</Text>
        </View>
      ) : null}

      {state.status === "error" ? (
        <FriendlyErrorBanner {...mapFailure(state.error)} />
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.screenPaddingX, paddingBottom: 24 },
  hint: {
    color: AppColors.textMuted,
    fontSize: 13,
    marginBottom: 12,
  },
  loadingWrap: {
    paddingVertical: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(141, 162, 255, 0.25)",
  },
  emptyTitle: {
    color: AppColors.textPrimary,
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 8,
  },
  emptyBody: { color: AppColors.textMuted, fontSize: 14, lineHeight: 20 },
});
