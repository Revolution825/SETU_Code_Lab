import CodeMirror, {
  EditorState,
  highlightActiveLine,
  highlightActiveLineGutter,
  lineNumbers,
} from "@uiw/react-codemirror";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import {
  bracketMatching,
  indentOnInput,
  indentUnit,
  syntaxHighlighting,
} from "@codemirror/language";
import { closeBrackets } from "@codemirror/autocomplete";
import {
  oneDarkTheme,
  oneDarkHighlightStyle,
} from "@codemirror/theme-one-dark";

interface CodeEditorProps {
  value: string;
  height?: string;
  editable?: boolean;
  language?: string;
  onChange: (value: string) => void;
}

const getLanguageExtension = (language?: string) => {
  switch (language) {
    case "python":
      return python();
    case "java":
    default:
      return java();
  }
};

export default function CodeEditor({
  value,
  editable,
  language,
  onChange,
}: Readonly<CodeEditorProps>) {
  return (
    <CodeMirror
      value={value}
      basicSetup={false}
      theme={oneDarkTheme}
      editable={editable}
      extensions={[
        getLanguageExtension(language),
        syntaxHighlighting(oneDarkHighlightStyle, { fallback: true }),
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        bracketMatching(),
        closeBrackets(),
        indentOnInput(),
        indentUnit.of("    "),
        EditorState.tabSize.of(4),
      ]}
      style={{ height: "100%" }}
      onChange={(val) => onChange(val)}
    />
  );
}
