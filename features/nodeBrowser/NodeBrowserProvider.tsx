import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  ReactNode,
} from "react";
import * as FileSystem from "expo-file-system";

import { useSettings } from "@/features/settings/SettingsProvider";

interface NodeBrowserContextValue {
  rootDirectory: NodeType | null;
  loading: boolean;
  refreshRootDirectory: () => Promise<void>;
}

const NodeBrowserContext = createContext<NodeBrowserContextValue | undefined>(
  undefined
);

interface NodeBrowserProviderProps {
  children: ReactNode;
}

export const NodeBrowserProvider: React.FC<NodeBrowserProviderProps> = ({
  children,
}) => {
  const { settings } = useSettings();
  const [rootDirectory, setRootDirectory] = useState<NodeType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const readDirectoryTree = async (path: string): Promise<NodeType> => {
    const result: NodeType = {
      name: "root",
      path,
      isDirectory: true,
      children: [],
    };
    const items = await FileSystem.readDirectoryAsync(path);

    for (const item of items) {
      const itemPath = `${path}/${item}`;
      const info = await FileSystem.getInfoAsync(itemPath);

      if (info.isDirectory) {
        result.children?.push(await readDirectoryTree(itemPath));
      } else {
        result.children?.push({
          name: item,
          path: itemPath,
          isDirectory: false,
        });
      }
    }

    return result;
  };

  const loadRootDirectory = async () => {
    setLoading(true);
    if (settings.rootFilesystemNode === "" || !settings.rootFilesystemNode) {
      console.error("No root directory specified");
      setLoading(false);
      setRootDirectory(null);
      return;
    }
    try {
      const rootNode = await readDirectoryTree(settings.rootFilesystemNode);
      setRootDirectory(rootNode);
    } catch (error) {
      console.error("Failed to load root directory:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshRootDirectory = async () => {
    await loadRootDirectory();
  };

  useEffect(() => {
    loadRootDirectory();
  }, [settings?.rootFilesystemNode]);

  const value = useMemo(
    () => ({ rootDirectory, loading, refreshRootDirectory }),
    [rootDirectory, loading]
  );

  return (
    <>
      {!loading && (
        <NodeBrowserContext.Provider value={value}>
          {children}
        </NodeBrowserContext.Provider>
      )}
    </>
  );
};

export const useNodeBrowser = (): NodeBrowserContextValue => {
  const context = useContext(NodeBrowserContext);
  if (context === undefined) {
    throw new Error("useNodeBrowser must be used within a NodeBrowserProvider");
  }
  return context;
};
