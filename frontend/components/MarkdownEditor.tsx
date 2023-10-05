import React from 'react';
import dynamic from 'next/dynamic';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'next-i18next';
import { useColorMode } from '~/providers/ThemeProvider';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { useSnackbar } from '~/providers/SnackbarProvider';
import { useGetUploadDataMutation } from '~/generated/graphql';
import handleApolloError from '~/functions/handleApolloError';
import putFile from '~/functions/putFile';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor'),
  { ssr: false },
);
export default function MarkdownEditor({
  body,
  onBodyChange,
  header,
}: {
  body: string;
  onBodyChange: (value: string) => void;
  header: string;
}) {
  const { t } = useTranslation();
  const [fileName, setFileName] = React.useState('');
  const { showMessage } = useSnackbar();
  const [getUploadData] = useGetUploadDataMutation({
    variables: {
      header,
      fileName,
    },
    onError: (error) => handleApolloError(error, showMessage, t),
  });
  const { mode } = useColorMode();

  return (
    <div data-color-mode={mode}>
      <MDEditor
        height={400}
        onPaste={async (e) => {
          if (e.clipboardData.files.length > 0) {
            const file = e.clipboardData.files[0];
            setFileName(`${uuidv4()}.${file.name.split('.').pop()}`);

            const data = await getUploadData();
            onBodyChange(`${body}uploading image...`);
            await
            putFile(data.data.article.getUploadData.uploadUrl, file, file.type, showMessage, t);

            onBodyChange(`${body}![${file.name}](${data.data.article.getUploadData.uploadUrl.split('?')[0]})`);
          }
        }}
        value={body}
        onChange={onBodyChange}
      />
    </div>
  );
}
