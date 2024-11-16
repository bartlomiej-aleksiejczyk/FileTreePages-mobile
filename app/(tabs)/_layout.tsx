import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SettingsProvider } from "@/features/settings/SettingsProvider";
import { NodeBrowserProvider } from "@/features/nodeBrowser/NodeBrowserProvider";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <SettingsProvider>
      <NodeBrowserProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
            headerShown: false,
          }}
        >
          <Tabs.Screen
            name="edit-node/index"
            options={{
              title: "Edit node",
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon
                  name={focused ? "home" : "home-outline"}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="settings/index"
            options={{
              title: "Settings",
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon
                  name={focused ? "code-slash" : "code-slash-outline"}
                  color={color}
                />
              ),
            }}
          />
        </Tabs>
      </NodeBrowserProvider>
    </SettingsProvider>
  );
}
