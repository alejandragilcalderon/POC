import { ApiError } from "@/core/network/api-error";
import type { IHttpClient } from "@/core/network/http-client.interface";

type HttpClientDeps = {
  baseUrl: string;
};

/**
 * Thin fetch wrapper (Single Responsibility).
 */
export class HttpClientImpl implements IHttpClient {
  constructor(private readonly deps: HttpClientDeps) {}

  async getJson<T>(path: string, headers?: Record<string, string>): Promise<T> {
    const base = this.deps.baseUrl.replace(/\/$/, "");
    const p = path.startsWith("/") ? path : `/${path}`;
    const url = `${base}${p}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...headers,
      },
    });
    const text = await res.text();
    let body: unknown;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = { raw: text };
    }
    if (!res.ok) {
      const msg =
        typeof body === "object" &&
        body !== null &&
        "message" in body &&
        typeof (body as { message?: string }).message === "string"
          ? (body as { message: string }).message
          : res.statusText;
      throw new ApiError(res.status, msg, body);
    }
    return body as T;
  }
}
