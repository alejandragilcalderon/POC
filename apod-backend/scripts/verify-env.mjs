#!/usr/bin/env node
/**
 * Ensures secrets are present via environment or .env files (same filenames Next.js loads).
 * Run automatically before `next build` / `next start` so keys are never required in source.
 *
 * Shell example (no files):
 *   export NASA_APOD_API_KEY="…"
 *   npm run build
 */

import dotenv from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();

if (process.env.SKIP_ENV_VALIDATION === "1") {
  process.exit(0);
}

const modeArg = process.argv.find((a) => a.startsWith("--mode="));
const mode = modeArg?.slice("--mode=".length) === "development" ? "development" : "production";

/** Same relative priority as Next.js env files for dev vs production. */
const envFiles =
  mode === "development"
    ? [".env", ".env.development", ".env.local", ".env.development.local"]
    : [".env", ".env.production", ".env.local", ".env.production.local"];

for (const file of envFiles) {
  const path = resolve(root, file);
  if (existsSync(path)) {
    dotenv.config({ path, override: true });
  }
}

const nasa = process.env.NASA_APOD_API_KEY?.trim();
if (!nasa) {
  console.error(
    "[verify-env] Missing configuration:\n  - NASA_APOD_API_KEY is required (set in shell or .env.local / .env.production.local)."
  );
  console.error(
    "\n[verify-env] Provide variables in your terminal before the command, or in a local env file (gitignored). Never commit API keys."
  );
  process.exit(1);
}

process.exit(0);
