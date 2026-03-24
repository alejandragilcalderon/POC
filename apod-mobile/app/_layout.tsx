import "react-native-gesture-handler";

import { useEffect } from "react";
import { AppContainerProvider } from "@/core/di/app-container";
import { initTelemetry } from "@/shared/services/telemetry.service";
import { GestureRootWidget } from "@/shared/ui/widgets/gesture-root.widget";
import { RootStackWidget } from "@/shared/ui/widgets/root-stack.widget";

export default function RootLayout() {
  useEffect(() => {
    void initTelemetry();
  }, []);

  return (
    <GestureRootWidget>
      <AppContainerProvider>
        <RootStackWidget />
      </AppContainerProvider>
    </GestureRootWidget>
  );
}
