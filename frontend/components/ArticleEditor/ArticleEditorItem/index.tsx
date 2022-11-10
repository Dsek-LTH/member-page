import React from 'react';
import { useTranslation } from 'next-i18next';
// @ts-ignore package does not have typescript types
import ReactMde from 'react-mde';
import 'react-mde/lib/styles/css/react-mde-all.css';
import ReactMarkdown from 'react-markdown';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useGetUploadDataMutation } from '~/generated/graphql';
import putFile from '~/functions/putFile';
import { useSnackbar } from '~/providers/SnackbarProvider';
import handleApolloError from '~/functions/handleApolloError';
import Link from '~/components/Link';

type EditorProps = {
  header: string;
  body: string;
  selectedTab: 'write' | 'preview';
  onTabChange: (tab: 'write' | 'preview') => void;
  onHeaderChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  imageName: string;
  onBodyChange: (value: string) => void;
  publishAsOptions: { id: string; label: string }[];
  mandateId: string;
  setMandateId: (value) => void;
};

export default function ArticleEditorItem({
  header,
  body,
  selectedTab,
  onTabChange,
  onHeaderChange,
  onBodyChange,
  onImageChange,
  imageName,
  publishAsOptions,
  mandateId,
  setMandateId,
}: EditorProps) {
  const [fileName, setFileName] = React.useState('');
  const { showMessage } = useSnackbar();
  const { t } = useTranslation();

  const [getUploadData] = useGetUploadDataMutation({
    variables: {
      header,
      fileName,
    },
    onError: (error) => handleApolloError(error, showMessage, t),
  });

  const saveImage = async function* (_, file: File) {
    setFileName(`${uuidv4()}.${file.name.split('.').pop()}`);

    const data = await getUploadData();
    putFile(data.data.article.getUploadData.uploadUrl, file, file.type, showMessage, t);

    yield data.data.article.getUploadData.uploadUrl.split('?')[0];
    return true;
  };

  return (
    <Stack spacing={2}>
      <TextField
        id="header-field"
        label={t('news:header')}
        onChange={onHeaderChange}
        multiline
        value={header}
      />
      <FormControl>
        <InputLabel id="demo-simple-select-label">{t('news:publish_as')}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          defaultValue="none"
          value={mandateId}
          label={t('news:publish_as')}
          onChange={(event) => setMandateId(event.target.value)}
        >
          {publishAsOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
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
            onChange={onImageChange}
            id="contained-button-file"
          />
        </Button>
      </label>
      <Link newTab href="https://www.markdownguide.org/cheat-sheet/">{t('news:markdown_guide')}</Link>
      <ReactMde
        value={body}
        onChange={onBodyChange}
        selectedTab={selectedTab}
        onTabChange={onTabChange}
        l18n={{
          write: t('news:write'),
          preview: t('news:preview'),
          uploadingImage: t('news:uploadingImage'),
          pasteDropSelect: t('news:pasteDropSelect'),
        }}
        generateMarkdownPreview={(markdown) =>
          Promise.resolve(<ReactMarkdown>{markdown}</ReactMarkdown>)}
        paste={{
          saveImage,
        }}
      />
    </Stack>
  );
}
