import type { InsightWeatherPayload } from "@/modules/insight-weather/domain/entities/insight-weather-payload";

function asRecord(v: unknown): Record<string, unknown> | null {
  if (typeof v !== "object" || v === null || Array.isArray(v)) return null;
  return v as Record<string, unknown>;
}

function readNum(obj: Record<string, unknown> | undefined, key: string): number | undefined {
  if (!obj) return undefined;
  const v = obj[key];
  if (typeof v === "number" && Number.isFinite(v)) return v;
  return undefined;
}

type SensorBlock = { av?: number; mn?: number; mx?: number; ct?: number };

function parseSensorBlock(v: unknown): SensorBlock | undefined {
  const o = asRecord(v);
  if (!o) return undefined;
  return {
    av: readNum(o, "av"),
    mn: readNum(o, "mn"),
    mx: readNum(o, "mx"),
    ct: readNum(o, "ct"),
  };
}

function parseWindCompass(wd: unknown): string | undefined {
  const o = asRecord(wd);
  if (!o) return undefined;
  for (const k of Object.keys(o)) {
    const inner = asRecord(o[k]);
    const pt = inner?.compass_point;
    if (typeof pt === "string" && pt.trim()) return pt.trim();
  }
  return undefined;
}

function asSolKey(x: unknown): string | null {
  if (typeof x === "string" && /^\d+$/.test(x)) return x;
  if (typeof x === "number" && Number.isFinite(x) && x >= 0 && Number.isInteger(x)) {
    return String(x);
  }
  return null;
}

function titleCaseSeason(s: string): string {
  return s
    .trim()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export type SolWeatherReading = {
  sol: string;
  firstUtc?: string;
  lastUtc?: string;
  season?: string;
  northernSeason?: string;
  southernSeason?: string;
  tempC?: { avg?: number; min?: number; max?: number; samples?: number };
  windMs?: { avg?: number; min?: number; max?: number; samples?: number };
  pressurePa?: { avg?: number; min?: number; max?: number; samples?: number };
  windCompass?: string;
};

const ROOT_SKIP = new Set(["sol_keys", "validity_checks"]);

/**
 * Maps NASA InSight `insight_weather`-style JSON into rows for UI (per-Sol blocks).
 */
export function extractSolReadings(payload: InsightWeatherPayload): SolWeatherReading[] {
  const keysFromApi = Array.isArray(payload.sol_keys)
    ? (payload.sol_keys as unknown[]).map(asSolKey).filter((k): k is string => k !== null)
    : [];

  const numericKeys = Object.keys(payload).filter(
    (k) => !ROOT_SKIP.has(k) && /^\d+$/.test(k)
  );

  const order =
    keysFromApi.length > 0 ? keysFromApi : [...numericKeys].sort((a, b) => Number(a) - Number(b));

  return order.map((sol) => {
    const node = asRecord(payload[sol]);
    if (!node) {
      return { sol };
    }

    const at = parseSensorBlock(node.AT);
    const hws = parseSensorBlock(node.HWS);
    const pre = parseSensorBlock(node.PRE);

    const firstUtc = typeof node.First_UTC === "string" ? node.First_UTC : undefined;
    const lastUtc = typeof node.Last_UTC === "string" ? node.Last_UTC : undefined;
    const season = typeof node.Season === "string" ? titleCaseSeason(node.Season) : undefined;
    const northernSeason =
      typeof node.Northern_season === "string" ? titleCaseSeason(node.Northern_season) : undefined;
    const southernSeason =
      typeof node.Southern_season === "string" ? titleCaseSeason(node.Southern_season) : undefined;

    return {
      sol,
      firstUtc,
      lastUtc,
      season,
      northernSeason,
      southernSeason,
      tempC: at
        ? { avg: at.av, min: at.mn, max: at.mx, samples: at.ct }
        : undefined,
      windMs: hws
        ? { avg: hws.av, min: hws.mn, max: hws.mx, samples: hws.ct }
        : undefined,
      pressurePa: pre
        ? { avg: pre.av, min: pre.mn, max: pre.mx, samples: pre.ct }
        : undefined,
      windCompass: parseWindCompass(node.WD),
    };
  });
}
