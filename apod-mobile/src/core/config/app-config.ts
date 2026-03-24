import { Platform } from "react-native";
import * as Device from "expo-device";

function requirePublic(key: string, value: string | undefined): string {
  if (!value?.trim()) {
    throw new Error(
      `Missing ${key}. Set it in .env (EXPO_PUBLIC_*) or your CI env before \`npx expo start\` / EAS Build.`
    );
  }
  return value.trim();
}

/**
 * Android emulators cannot reach the host via 127.0.0.1/localhost — that points at the emulator itself.
 * `10.0.2.2` is the special alias to the host machine (see Android emulator networking docs).
 * Only applies when running on an Android emulator; physical devices keep your URL (LAN IP, etc.).
 */
export function rewriteLocalhostForAndroidEmulator(urlString: string): string {
  try {
    const u = new URL(urlString);
    if (u.hostname === "localhost" || u.hostname === "127.0.0.1") {
      u.hostname = "10.0.2.2";
    }
    return u.toString();
  } catch {
    return urlString;
  }
}

export function getApiBaseUrl(): string {
  const raw = requirePublic("EXPO_PUBLIC_API_BASE_URL", process.env.EXPO_PUBLIC_API_BASE_URL);
  if (Platform.OS !== "android") {
    return raw;
  }
  if (Device.isDevice) {
    return raw;
  }
  return rewriteLocalhostForAndroidEmulator(raw);
}
