import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { useColorMode } from '~/providers/ThemeProvider';

const MD = dynamic(
  () => import('@uiw/react-markdown-preview').then((mod) => mod.default),
  { ssr: true },
);
export default function Markdown({ content }: { content: string }) {
  const { mode } = useColorMode();
  return (
    <div data-color-mode={mode}>
      <MD
        source={content}
        style={{
          backgroundColor: 'transparent',
          padding: '1rem 0',
        }}
      />
    </div>
  );
}
