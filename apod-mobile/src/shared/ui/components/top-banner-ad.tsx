import { useEffect, useMemo, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { spacing, strings } from "@/shared/resources";
import { AppColors } from "@/shared/ui/theme/colors";
import { recordNonFatal } from "@/shared/services/telemetry.service";

type AdsModule = {
  BannerAd: React.ComponentType<{
    unitId: string;
    size: string;
    requestOptions?: { requestNonPersonalizedAdsOnly?: boolean };
  }>;
  BannerAdSize: { ANCHORED_ADAPTIVE_BANNER: string };
  TestIds: { BANNER: string };
  default: () => { initialize: () => Promise<unknown> };
};

function loadAdsModule(): AdsModule | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("react-native-google-mobile-ads") as AdsModule;
  } catch {
    return null;
  }
}

function resolveUnitId(mod: AdsModule): string {
  const configured =
    Platform.OS === "ios"
      ? process.env.EXPO_PUBLIC_ADMOB_BANNER_IOS
      : process.env.EXPO_PUBLIC_ADMOB_BANNER_ANDROID;

  return configured?.trim() || mod.TestIds.BANNER;
}

export function TopBannerAd() {
  const [ready, setReady] = useState(false);
  const ads = useMemo(loadAdsModule, []);

  useEffect(() => {
    if (process.env.EXPO_PUBLIC_ADS_ENABLED === "false") {
      return;
    }
    if (!ads || Platform.OS === "web") {
      return;
    }

    let cancelled = false;
    void ads
      .default()
      .initialize()
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch((e: unknown) => {
        recordNonFatal(e, "mobile_ads_initialize");
      });

    return () => {
      cancelled = true;
    };
  }, [ads]);

  if (Platform.OS === "web") return null;
  if (process.env.EXPO_PUBLIC_ADS_ENABLED === "false") return null;
  if (!ads || !ready) return null;

  const BannerAd = ads.BannerAd;
  const BannerAdSize = ads.BannerAdSize;
  const unitId = resolveUnitId(ads);

  return (
    <View style={styles.wrap} accessibilityLabel="ad-banner">
      <Text style={styles.label}>{strings.ads.sponsoredLabel}</Text>
      <BannerAd
        unitId={unitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.adTopMargin,
    marginBottom: spacing.adBottomMargin,
    alignItems: "center",
  },
  label: {
    color: AppColors.textMuted,
    fontSize: 11,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
});
