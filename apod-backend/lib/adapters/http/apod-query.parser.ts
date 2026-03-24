import type { ApodQuery } from "@/lib/domain/apod-query";
import { err, ok, type ValidationResult } from "@/lib/domain/validation-result";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidDateString(s: string): boolean {
  if (!DATE_RE.test(s)) return false;
  const d = new Date(s + "T12:00:00Z");
  return !Number.isNaN(d.getTime());
}

/**
 * HTTP adapter: maps URL search params to a validated {@link ApodQuery}.
 */
export function parseApodQueryParams(
  searchParams: URLSearchParams
): ValidationResult<ApodQuery> {
  const date = searchParams.get("date") ?? undefined;
  const start_date = searchParams.get("start_date") ?? undefined;
  const end_date = searchParams.get("end_date") ?? undefined;
  const countRaw = searchParams.get("count");
  const thumbsRaw = searchParams.get("thumbs");

  const hasDate = date !== undefined;
  const hasRange = start_date !== undefined || end_date !== undefined;
  const count =
    countRaw === null || countRaw === ""
      ? undefined
      : Number.parseInt(countRaw, 10);
  const hasCount = countRaw !== null && countRaw !== "";

  if (hasCount && (Number.isNaN(count!) || count! < 1)) {
    return err("count must be a positive integer");
  }

  const thumbs =
    thumbsRaw === "true" || thumbsRaw === "1" || thumbsRaw === "yes";

  if (hasDate && hasRange) {
    return err("date cannot be used together with start_date or end_date");
  }
  if (hasDate && hasCount) {
    return err("date cannot be used together with count");
  }
  if (hasRange && hasCount) {
    return err("start_date/end_date cannot be used together with count");
  }

  if (hasDate) {
    if (!isValidDateString(date!)) return err("date must be YYYY-MM-DD");
    return ok({ mode: { kind: "single", date }, thumbs });
  }

  if (hasCount) {
    return ok({ mode: { kind: "random", count: count! }, thumbs });
  }

  if (start_date !== undefined) {
    if (!isValidDateString(start_date)) {
      return err("start_date must be YYYY-MM-DD");
    }
    if (end_date !== undefined && !isValidDateString(end_date)) {
      return err("end_date must be YYYY-MM-DD");
    }
    return ok({
      mode: { kind: "range", start_date, end_date },
      thumbs,
    });
  }

  if (end_date !== undefined) {
    return err("end_date requires start_date");
  }

  return ok({ mode: { kind: "single" }, thumbs });
}
