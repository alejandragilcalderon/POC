import React, { createContext, useContext, useMemo } from "react";
import {
  createAppDependencies,
  type AppDependencies,
} from "@/core/di/create-dependencies";

const Ctx = createContext<AppDependencies | null>(null);

export function AppContainerProvider({ children }: { children: React.ReactNode }) {
  const deps = useMemo(() => createAppDependencies(), []);
  return <Ctx.Provider value={deps}>{children}</Ctx.Provider>;
}

export function useAppDependencies(): AppDependencies {
  const v = useContext(Ctx);
  if (!v) {
    throw new Error("useAppDependencies must be used inside AppContainerProvider");
  }
  return v;
}
