import { Platform } from "react-native";

type AnalyticsLike = {
  logScreenView: (params: { screen_name: string; screen_class: string }) => Promise<void>;
};

type CrashlyticsLike = {
  setCrashlyticsCollectionEnabled: (enabled: boolean) => Promise<void>;
  log: (message: string) => void;
  recordError: (error: Error) => void;
};

let initialized = false;

function getFirebaseSdk(): {
  analytics?: () => AnalyticsLike;
  crashlytics?: () => CrashlyticsLike;
} {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const analyticsModule = require("@react-native-firebase/analytics");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const crashlyticsModule = require("@react-native-firebase/crashlytics");
    return {
      analytics: analyticsModule?.default,
      crashlytics: crashlyticsModule?.default,
    };
  } catch {
    // Expo Go and test environments may not include native Firebase modules.
    return {};
  }
}

export async function initTelemetry(): Promise<void> {
  if (initialized) return;
  if (Platform.OS !== "ios" && Platform.OS !== "android") return;

  const { analytics, crashlytics } = getFirebaseSdk();

  try {
    if (crashlytics) {
      await crashlytics().setCrashlyticsCollectionEnabled(true);
      crashlytics().log("Crashlytics initialized");
    }
    if (analytics) {
      await analytics().logScreenView({
        screen_name: "app_start",
        screen_class: "RootLayout",
      });
    }
  } catch {
    // Keep app usable even when native telemetry isn't configured yet.
  }

  initialized = true;
}

export async function logScreenView(screenName: string): Promise<void> {
  const { analytics, crashlytics } = getFirebaseSdk();
  try {
    if (analytics) {
      await analytics().logScreenView({
        screen_name: screenName,
        screen_class: screenName,
      });
    }
    if (crashlytics) {
      crashlytics().log(`Screen: ${screenName}`);
    }
  } catch {
    // Best-effort telemetry only.
  }
}

export function recordNonFatal(error: unknown, context: string): void {
  const { crashlytics } = getFirebaseSdk();
  if (!crashlytics) return;
  const err = error instanceof Error ? error : new Error(String(error));
  try {
    crashlytics().log(`Non-fatal: ${context}`);
    crashlytics().recordError(err);
  } catch {
    // Best-effort only.
  }
}
