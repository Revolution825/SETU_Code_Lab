import CodeMirror, { EditorState, highlightActiveLine, highlightActiveLineGutter, lineNumbers } from '@uiw/react-codemirror';
import { java } from '@codemirror/lang-java';
import { bracketMatching, indentOnInput, indentUnit, syntaxHighlighting } from '@codemirror/language';
import { closeBrackets } from '@codemirror/autocomplete';
import { oneDarkTheme, oneDarkHighlightStyle } from '@codemirror/theme-one-dark';

interface CodeEditorProps {
  value: string;
  height?: string;
  onChange: (value: string) => void;
}

export default function CodeEditor({ value, onChange }: Readonly<CodeEditorProps>) {
  return (
    <CodeMirror
      value={value}
      basicSetup={false}
      theme={oneDarkTheme}
      extensions={[
        java(),
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
      style={{ height: '100%' }}
      onChange={(val) => onChange(val)}
    />
  );
}