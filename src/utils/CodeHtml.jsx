import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const CodeHtml = ({children, lang}) => {
  return (
    <SyntaxHighlighter language={lang} style={vscDarkPlus}>
      {children}
    </SyntaxHighlighter>
  );
};