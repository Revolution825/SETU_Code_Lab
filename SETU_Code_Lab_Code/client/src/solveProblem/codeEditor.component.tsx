import CodeMirror from '@uiw/react-codemirror';
import { java } from '@codemirror/lang-java';
import { oneDark } from '@codemirror/theme-one-dark';

interface CodeEditorProps {
  value: string;
  height?: string;
  onChange: (value: string) => void;
}

export default function CodeEditor({ value, onChange }: Readonly<CodeEditorProps>) {
  return (
    <CodeMirror
      value={value}
      extensions={[java()]}
      style={{height:'100%'}}
      theme={oneDark}
      onChange={(val) => onChange(val)}
    />
  );
}