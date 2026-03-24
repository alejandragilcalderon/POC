/**
 * Functional-style result (explicit success/failure; no thrown control flow in domain).
 */
export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

export function ok<T, E = never>(value: T): Result<T, E> {
  return { ok: true, value };
}

export function fail<T = never, E = unknown>(error: E): Result<T, E> {
  return { ok: false, error };
}
