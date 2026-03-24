import { useCallback, useState } from "react";
import type { ApodPayload } from "@/modules/apod/domain/entities/apod-entry";
import type { ApodQuery } from "@/modules/apod/domain/entities/apod-query";
import type { ApodFailure } from "@/modules/apod/domain/ports/apod-repository.port";
import { useAppDependencies } from "@/core/di/app-container";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: ApodPayload }
  | { status: "error"; error: ApodFailure };

export function useApod() {
  const { getApodUseCase } = useAppDependencies();
  const [state, setState] = useState<State>({ status: "idle" });

  const load = useCallback(
    async (query: ApodQuery) => {
      setState({ status: "loading" });
      const result = await getApodUseCase.execute(query);
      if (result.ok) {
        setState({ status: "success", data: result.value });
      } else {
        setState({ status: "error", error: result.error });
      }
    },
    [getApodUseCase]
  );

  return { state, load };
}
