import { NextResponse } from "next/server";
import { GetHealthUseCase } from "@/lib/application/health/get-health.use-case";

export const dynamic = "force-dynamic";

const getHealth = new GetHealthUseCase();

/**
 * GET /api/health — Liveness: process is up (no upstream or DB checks).
 * Uses application use case only (no NASA wiring) so this route stays cheap and key-agnostic.
 */
export async function GET() {
  return NextResponse.json(getHealth.execute());
}
