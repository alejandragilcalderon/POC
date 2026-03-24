/**
 * Domain entity for a single NASA APOD item (framework-agnostic).
 */
export type ApodEntry = {
  date: string;
  title: string;
  explanation: string;
  url: string;
  mediaType: string;
  hdUrl?: string;
  copyright?: string;
  thumbnailUrl?: string;
};

export type ApodPayload = ApodEntry | ApodEntry[];
