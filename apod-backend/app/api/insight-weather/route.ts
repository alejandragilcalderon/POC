import { NextResponse } from "next/server";
import { createAppContainer } from "@/lib/composition/app.container";
import { UpstreamHttpError } from "@/lib/domain/errors/upstream-http.error";

export const dynamic = "force-dynamic";

function getContainer() {
  return createAppContainer();
}

/**
 * GET /api/insight-weather — Proxies NASA InSight Mars Weather (per-Sol summaries).
 * Server uses NASA_APOD_API_KEY (api.nasa.gov); clients must not pass api_key.
 */
export async function GET() {
  const { getInsightWeather } = getContainer();

  try {
    const data = await getInsightWeather.execute();
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
