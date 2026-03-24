function requirePublic(key: string, value: string | undefined): string {
  if (!value?.trim()) {
    throw new Error(
      `Missing ${key}. Set it in .env (EXPO_PUBLIC_*) or your CI env before \`npx expo start\` / EAS Build.`
    );
  }
  return value.trim();
}

export function getApiBaseUrl(): string {
  return requirePublic("EXPO_PUBLIC_API_BASE_URL", process.env.EXPO_PUBLIC_API_BASE_URL);
}
