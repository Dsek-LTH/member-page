import ReactMarkdown from 'react-markdown';
import Link from './Link';

export default function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        a: Link,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
