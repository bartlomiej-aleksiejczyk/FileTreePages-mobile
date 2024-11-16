import React, { useState, useEffect } from "react";

const MOCKED_FILE_SYSTEM: Record<string, string> = {
  "/Documents/Resume.pdf": "This is a resume file.",
  "/Documents/Project/index.js": "console.log('Hello, World!');",
  "/Photos/Vacation.jpg": "This is binary data representing an image.",
  "/file1.txt": "Sample text content for file1.txt.",
};

type FileEditorProps = {
  filePath: string;
};

const FileEditor: React.FC<FileEditorProps> = ({ filePath }) => {
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFile = () => {
      if (MOCKED_FILE_SYSTEM[filePath]) {
        setContent(MOCKED_FILE_SYSTEM[filePath]);
      } else {
        setError("File not found.");
      }
    };

    loadFile();
  }, [filePath]);

  const saveFile = () => {
    MOCKED_FILE_SYSTEM[filePath] = content; // Mock saving the file
    alert("File saved successfully!");
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
