import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { ScreenSurface } from "@/shared/ui/components/screen-surface";
import { useInsightWeather } from "@/modules/insight-weather/presentation/hooks/use-insight-weather";
import { InsightWeatherWidget } from "@/modules/insight-weather/presentation/widgets/insight-weather.widget";
import { spacing, strings } from "@/shared/resources";
import { logScreenView } from "@/shared/services/telemetry.service";
import { TopBannerAd } from "@/shared/ui/components/top-banner-ad";
import { AppColors } from "@/shared/ui/theme/colors";

export function InsightWeatherScreen() {
  const { load, state } = useInsightWeather();
  const [pullRefreshing, setPullRefreshing] = useState(false);

  const runLoad = useCallback(() => {
    void load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      runLoad();
      void logScreenView("Insight_Weather");
    }, [runLoad])
  );

  const onRefresh = useCallback(async () => {
    setPullRefreshing(true);
    await load();
    setPullRefreshing(false);
  }, [load]);

  return (
    <ScreenSurface>
      <TopBannerAd />
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">
          {strings.insightWeather.screenTitle}
        </Text>
        <Text style={styles.subtitle}>{strings.insightWeather.screenSubtitle}</Text>
      </View>
      <InsightWeatherWidget
        state={state}
        onRefresh={onRefresh}
        refreshing={pullRefreshing}
      />
    </ScreenSurface>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.screenPaddingX,
    marginBottom: spacing.sectionGapSm,
  },
  title: { color: AppColors.textPrimary, fontSize: 22, fontWeight: "800", marginBottom: 8 },
  subtitle: { color: AppColors.textMuted, fontSize: 14, lineHeight: 20 },
});
