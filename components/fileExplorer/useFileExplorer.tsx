import { useState, useEffect } from "react";
import * as FileSystem from "expo-file-system";

type FileInfo = {
  name: string;
  path: string;
};

const DEFAULT_ROOT_DIRECTORY = FileSystem.documentDirectory || "~";

export const useFileExplorer = (rootPath: string = DEFAULT_ROOT_DIRECTORY) => {
  const [currentPath, setCurrentPath] = useState<string>(rootPath);
  const [items, setItems] = useState<FileInfo[]>([]);
  const [pathHistory, setPathHistory] = useState<string[]>([rootPath]);

  const fetchDirectory = async (path: string) => {
    try {
      const directoryContents = await FileSystem.readDirectoryAsync(path);
      setItems(
        directoryContents.map((name) => ({
          name,
          path: `${path}/${name}`,
        }))
      );
    } catch (error) {
      console.error("Failed to read directory:", error);
      setItems([]);
    }
  };

  const navigateTo = (path: string) => {
    setPathHistory((prevHistory) => [...prevHistory, path]);
    setCurrentPath(path);
  };

  const goUp = () => {
    if (pathHistory.length > 1) {
      const newPathHistory = [...pathHistory];
      newPathHistory.pop();
      const parentPath = newPathHistory[newPathHistory.length - 1];
      setPathHistory(newPathHistory);
      setCurrentPath(parentPath);
    }
  };

  const getInfo = async (path: string) => {
    try {
      return await FileSystem.getInfoAsync(path);
    } catch (error) {
      console.error("Failed to get file/directory info:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchDirectory(currentPath);
  }, [currentPath]);

  return {
    currentPath,
    items,
    navigateTo,
    goUp,
    getInfo,
    pathHistory,
  };
};
