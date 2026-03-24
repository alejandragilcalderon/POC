/**
 * Raw NASA / backend JSON (snake_case). Kept in data layer only.
 */
export type ApodRecordDto = {
  date?: string;
  title?: string;
  explanation?: string;
  url?: string;
  hdurl?: string;
  media_type?: string;
  copyright?: string;
  thumbnail_url?: string;
};
