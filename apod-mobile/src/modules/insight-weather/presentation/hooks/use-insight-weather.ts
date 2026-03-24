import { useCallback, useState } from "react";
import type { InsightWeatherPayload } from "@/modules/insight-weather/domain/entities/insight-weather-payload";
import type { InsightWeatherFailure } from "@/modules/insight-weather/domain/ports/insight-weather-repository.port";
import { useAppDependencies } from "@/core/di/app-container";

type State =
  | { status: "idle" }
  | { status: "loading"; previousData?: InsightWeatherPayload }
  | { status: "success"; data: InsightWeatherPayload }
  | { status: "error"; error: InsightWeatherFailure };

export function useInsightWeather() {
  const { getInsightWeatherUseCase } = useAppDependencies();
  const [state, setState] = useState<State>({ status: "idle" });

  const load = useCallback(async () => {
    setState((prev) => ({
      status: "loading",
      previousData: prev.status === "success" ? prev.data : undefined,
    }));
    const result = await getInsightWeatherUseCase.execute();
    if (result.ok) {
      setState({ status: "success", data: result.value });
    } else {
      setState({ status: "error", error: result.error });
    }
  }, [getInsightWeatherUseCase]);

  return { state, load };
}
