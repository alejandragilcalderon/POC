import "react-native-gesture-handler";

import { AppContainerProvider } from "@/core/di/app-container";
import { GestureRootWidget } from "@/shared/ui/widgets/gesture-root.widget";
import { RootStackWidget } from "@/shared/ui/widgets/root-stack.widget";

export default function RootLayout() {
  return (
    <GestureRootWidget>
      <AppContainerProvider>
        <RootStackWidget />
      </AppContainerProvider>
    </GestureRootWidget>
  );
}
