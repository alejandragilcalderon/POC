import "server-only";

function requiredEnv(name: string): string {
  const v = process.env[name]?.trim();
  if (!v) {
    throw new Error(
      `${name} must be set in the environment (e.g. export before \`npm run build\` / \`npm run start\`, or use .env.local — never commit secrets).`
    );
  }
  return v;
}

/**
 * NASA APOD key — server-only; never NEXT_PUBLIC_* and never hardcoded in source.
 */
export function getNasaApodApiKey(): string {
  return requiredEnv("NASA_APOD_API_KEY");
}
