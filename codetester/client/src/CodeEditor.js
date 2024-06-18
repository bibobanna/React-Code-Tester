import React from 'react';
import Editor from "@monaco-editor/react";

function CodeEditor({ language }) {  // Accept a language prop
  const handleEditorChange = (value, event) => {
    console.log(value);
  };

  return (
    <Editor
      height="90vh"
      theme="dark"
      language={language}  // Use the language prop for the editor's language
      defaultValue="// type your code..."
      onChange={handleEditorChange}
    />
  );
}

export default CodeEditor;
