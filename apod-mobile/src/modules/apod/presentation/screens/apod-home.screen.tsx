import { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { LoadingIndicator } from "@/shared/ui/components/loading-indicator";
import { ScreenSurface } from "@/shared/ui/components/screen-surface";
import { useApod } from "@/modules/apod/presentation/hooks/use-apod";
import { ApodErrorMessageWidget } from "@/modules/apod/presentation/widgets/apod-error-message.widget";
import { ApodFeedWidget } from "@/modules/apod/presentation/widgets/apod-feed.widget";
import { spacing, strings } from "@/shared/resources";
import { AppColors } from "@/shared/ui/theme/colors";

export function ApodHomeScreen() {
  const { state, load } = useApod();

  const loadToday = useCallback(() => {
    void load({ mode: "single", thumbs: true });
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      loadToday();
    }, [loadToday])
  );

  return (
    <ScreenSurface>
      <View style={styles.intro}>
        <Text style={styles.introTitle}>{strings.apod.homeTitle}</Text>
        <Text style={styles.introBody}>{strings.apod.homeSubtitle}</Text>
      </View>
      {state.status === "loading" ? <LoadingIndicator /> : null}
      {state.status === "error" ? <ApodErrorMessageWidget failure={state.error} /> : null}
      {state.status === "success" ? <ApodFeedWidget data={state.data} /> : null}
    </ScreenSurface>
  );
}

const styles = StyleSheet.create({
  intro: {
    paddingHorizontal: spacing.screenPaddingX,
    marginBottom: spacing.sectionGapMd,
  },
  introTitle: {
    color: AppColors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  introBody: { color: AppColors.textMuted, fontSize: 14, lineHeight: 20 },
});
