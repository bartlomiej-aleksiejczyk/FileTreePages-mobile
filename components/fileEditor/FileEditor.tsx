import React, { useState, useEffect } from "react";
import * as FileSystem from "expo-file-system";

type FileEditorProps = {
  filePath: string;
};

const FileEditor: React.FC<FileEditorProps> = ({ filePath }) => {
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFile = async () => {
      try {
        const fileExists = await FileSystem.getInfoAsync(filePath);
        if (fileExists.exists) {
          const fileContent = await FileSystem.readAsStringAsync(filePath);
          setContent(fileContent);
        } else {
          setError("File not found.");
        }
      } catch (err) {
        console.error("Failed to load file:", err);
        setError("Failed to load file.");
      }
    };

    loadFile();
  }, [filePath]);

  const saveFile = async () => {
    try {
      await FileSystem.writeAsStringAsync(filePath, content);
      alert("File saved successfully!");
    } catch (err) {
      console.error("Failed to save file:", err);
      setError("Failed to save file.");
    }
  };

  return (
    <div>
      <h2>Editing File: {filePath}</h2>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: "100%", height: "200px" }}
          />
          <button onClick={saveFile}>Save</button>
        </>
      )}
    </div>
  );
};

export default FileEditor;
