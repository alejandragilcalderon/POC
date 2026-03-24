/**
 * Query aligned with apod-backend / NASA APOD (domain value object).
 */
export type ApodQuery =
  | { mode: "single"; date?: string; thumbs?: boolean }
  | { mode: "range"; startDate: string; endDate?: string; thumbs?: boolean }
  | { mode: "random"; count: number; thumbs?: boolean };
