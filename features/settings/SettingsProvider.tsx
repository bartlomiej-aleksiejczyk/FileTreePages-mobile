import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SettingsType } from "./SettingsType";
import { ThemedText } from "@/components/ThemedText";

export interface SettingsContext {
  settings: SettingsType;
  saveSettings?: (newSettings: SettingsType) => void;
}

const DEFAULT_SETTINGS = {
  rootFilesystemNode: "",
};

const SettingsContext = createContext<SettingsContext>({
  saveSettings: undefined,
  settings: DEFAULT_SETTINGS,
});

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [settings, setSettings] = useState<SettingsType>();
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const storedSettings = await AsyncStorage.getItem(
        "fileTreePagesSettings"
      );
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      } else {
        setSettings(DEFAULT_SETTINGS);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: SettingsType) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      await AsyncStorage.setItem(
        "userSettings",
        JSON.stringify(updatedSettings)
      );
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <>
      {loading || !settings ? (
        <ThemedText type="title">Edit node</ThemedText>
      ) : (
        <SettingsContext.Provider value={{ saveSettings, settings }}>
          {children}
        </SettingsContext.Provider>
      )}
    </>
  );
};

export const useSettings = () => useContext(SettingsContext);
