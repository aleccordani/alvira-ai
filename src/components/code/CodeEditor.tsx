import Editor from "@monaco-editor/react";

type Props = {
  value: string;
  language: string;
  onChange: (value: string) => void;
};

export default function CodeEditor({ value, language, onChange }: Props) {
  return (
    <Editor
      height="500px"
      theme="vs-dark"
      language={language}
      value={value}
      onChange={(value) => onChange(value || "")}
      options={{
        fontSize: 14,
        minimap: {
          enabled: false,
        },
        automaticLayout: true,
        tabSize: 2,
        wordWrap: "on",
        scrollBeyondLastLine: false,
      }}
    />
  );
}
