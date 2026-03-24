/**
 * Validated subset of NASA APOD query parameters (concept_tags are not modeled; disabled upstream).
 */
export type ApodQueryMode =
  | { kind: "single"; date?: string }
  | { kind: "range"; start_date: string; end_date?: string }
  | { kind: "random"; count: number };

export type ApodQuery = {
  mode: ApodQueryMode;
  thumbs: boolean;
};
