import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { spacing } from "@/shared/resources";
import { AppColors } from "@/shared/ui/theme/colors";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { paddingTop: spacing.tabScenePaddingTop },
        tabBarStyle: {
          backgroundColor: AppColors.background,
          borderTopColor: "rgba(141, 162, 255, 0.2)",
        },
        tabBarActiveTintColor: AppColors.accentSoft,
        tabBarInactiveTintColor: AppColors.textMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "NASA APOD",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="planet" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="insight-weather"
        options={{
          title: "Mars weather",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="partly-sunny" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
