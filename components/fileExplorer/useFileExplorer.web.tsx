import { useState, useEffect } from "react";

type FileInfo = {
  name: string;
  path: string;
  isDirectory?: boolean;
};

const MOCKED_FILE_SYSTEM: Record<string, FileInfo[]> = {
  "/": [
    { name: "Documents", path: "/Documents", isDirectory: true },
    { name: "Photos", path: "/Photos", isDirectory: true },
    { name: "file1.txt", path: "/file1.txt", isDirectory: false },
  ],
  "/Documents": [
    { name: "Resume.pdf", path: "/Documents/Resume.pdf", isDirectory: false },
    { name: "Project", path: "/Documents/Project", isDirectory: true },
  ],
  "/Documents/Project": [
    {
      name: "index.js",
      path: "/Documents/Project/index.js",
      isDirectory: false,
    },
  ],
  "/Photos": [
    { name: "Vacation.jpg", path: "/Photos/Vacation.jpg", isDirectory: false },
  ],
};

const DEFAULT_ROOT_DIRECTORY = "/";

export const useFileExplorer = (rootPath: string = DEFAULT_ROOT_DIRECTORY) => {
  const [currentPath, setCurrentPath] = useState<string>(rootPath);
  const [items, setItems] = useState<FileInfo[]>([]);
  const [pathHistory, setPathHistory] = useState<string[]>([rootPath]);

  const fetchDirectory = (path: string) => {
    if (MOCKED_FILE_SYSTEM[path]) {
      setItems(MOCKED_FILE_SYSTEM[path]);
    } else {
      console.error("Directory not found:", path);
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

  const getInfo = (path: string) => {
    for (const [dir, files] of Object.entries(MOCKED_FILE_SYSTEM)) {
      const item = files.find((file) => file.path === path);
      if (item) {
        return item;
      }
    }
    console.error("File or directory not found:", path);
    return null;
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
