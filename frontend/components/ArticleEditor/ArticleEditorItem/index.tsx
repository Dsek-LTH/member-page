import { useTranslation } from 'next-i18next';
import React from 'react';
// @ts-ignore package does not have typescript types
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import
{
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { v4 as uuidv4 } from 'uuid';
import Link from '~/components/Link';
import handleApolloError from '~/functions/handleApolloError';
import putFile from '~/functions/putFile';
import { useGetUploadDataMutation } from '~/generated/graphql';
import { useSnackbar } from '~/providers/SnackbarProvider';
import { useColorMode } from '~/providers/ThemeProvider';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor'),
  { ssr: false },
);
export type PublishAsOption = { id: string | undefined; label: string, type: 'Member' | 'Mandate' | 'Custom' };
export type ArticleEditorProps = {
  header: string;
  body: string;
  onHeaderChange: (value: string) => void;
  onImageChange: (file: File) => void;
  imageName: string;
  onBodyChange: (value: string) => void;
  publishAsOptions: PublishAsOption[];
  publishAs: PublishAsOption;
  setPublishAs: (value: PublishAsOption) => void;
};

export default function ArticleEditorItem({
  header,
  body,
  onHeaderChange,
  onBodyChange,
  onImageChange,
  imageName,
  publishAsOptions,
  publishAs,
  setPublishAs,
}: ArticleEditorProps) {
  const [fileName, setFileName] = React.useState('');
  const { showMessage } = useSnackbar();
  const { t } = useTranslation();
  const { mode } = useColorMode();

  const [getUploadData] = useGetUploadDataMutation({
    variables: {
      header,
      fileName,
    },
    onError: (error) => handleApolloError(error, showMessage, t),
  });

  return (
    <Stack spacing={2}>
      <TextField
        id="header-field"
        label={t('news:header')}
        onChange={(event) => onHeaderChange(event.target.value)}
        multiline
        value={header}
      />
      <FormControl>
        <InputLabel id="demo-simple-select-label">{t('news:publish_as')}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          defaultValue={publishAsOptions[0].id ?? 'none'}
          value={publishAs?.id ?? 'none'}
          label={t('news:publish_as')}
          onChange={(event) =>
            setPublishAs(
              publishAsOptions.find((option) => option.id === (event.target.value === 'none' ? undefined : event.target.value)),
            )}
        >
          {publishAsOptions.map((option) => (
            <MenuItem key={option.id} value={option.id ?? 'none'}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {imageName && (
        <Typography variant="subtitle1">
          <Typography fontWeight={500}>Current image:</Typography>
          {imageName}
        </Typography>
      )}
      <label htmlFor="contained-button-file">
        <Button
          variant="outlined"
          component="label"
          startIcon={<PhotoCamera />}
        >
          {t('news:selectImage')}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(event) => onImageChange(event.target.files[0])}
            id="contained-button-file"
          />
        </Button>
      </label>
      <Link newTab href="https://www.markdownguide.org/cheat-sheet/">{t('news:markdown_guide')}</Link>
      <div data-color-mode={mode}>
        <MDEditor
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

    </Stack>
  );
}
