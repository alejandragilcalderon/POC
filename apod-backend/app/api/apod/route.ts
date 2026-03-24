import { NextRequest, NextResponse } from "next/server";
import { parseApodQueryParams } from "@/lib/adapters/http/apod-query.parser";
import { createAppContainer } from "@/lib/composition/app.container";
import { UpstreamHttpError } from "@/lib/domain/errors/upstream-http.error";

export const dynamic = "force-dynamic";

function getContainer() {
  return createAppContainer();
}

/**
 * GET /api/apod — Proxies NASA APOD.
 * Query: date | (start_date, end_date) | count; optional thumbs.
 * Server uses NASA_APOD_API_KEY from the environment only (never hardcoded). Client api_key is not accepted.
 */
export async function GET(request: NextRequest) {
  const parsed = parseApodQueryParams(request.nextUrl.searchParams);
  if (!parsed.ok) {
    return NextResponse.json({ error: "Bad Request", message: parsed.message }, { status: 400 });
  }

  const { getApod } = getContainer();

  try {
    const data = await getApod.execute(parsed.value);
    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof UpstreamHttpError) {
      const status = e.statusCode >= 400 && e.statusCode < 600 ? e.statusCode : 502;
      return NextResponse.json(
        { error: "Upstream Error", message: e.message, details: e.body },
        { status }
      );
    }
    throw e;
  }
}
