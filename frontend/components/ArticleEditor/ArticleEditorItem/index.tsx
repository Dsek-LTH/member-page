import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
//@ts-ignore package does not have typescript types
import ReactMde from 'react-mde';
import 'react-mde/lib/styles/css/react-mde-all.css';
import ReactMarkdown from 'react-markdown';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { articleEditorItemStyles } from './articleEditorItemStyles';
import { useGetPresignedPutUrlMutation } from '~/generated/graphql';
import { v4 as uuidv4 } from 'uuid';
import * as FileType from 'file-type/browser';
import putFile from '~/functions/putFile';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
type EditorProps = {
  header: string;
  body: string;
  selectedTab: 'write' | 'preview';
  onTabChange: (tab: 'write' | 'preview') => void;
  onHeaderChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  imageName: string;
  onBodyChange: (value: string) => void;
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
}: EditorProps) {
  const classes = articleEditorItemStyles();
  const [fileName, setFileName] = React.useState('');

  const [getPresignedPutUrlMutation] = useGetPresignedPutUrlMutation({
    variables: {
      fileName: fileName,
    },
  });

  const { t } = useTranslation(['common', 'news']);

  const saveImage = async function* (inputData: ArrayBuffer) {
    const fileType = await FileType.fromBuffer(inputData);
    const file = new File([inputData], 'name', { type: fileType.mime });
    setFileName(`public/${uuidv4()}.${fileType.ext}`);

    const data = await getPresignedPutUrlMutation();
    putFile(data.data.article.presignedPutUrl, file, file.type);

    yield data.data.article.presignedPutUrl.split('?')[0];
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

      {imageName && (
        <Typography variant="subtitle1">
          <Typography fontWeight={500}>Current image:</Typography> {imageName}
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
          Promise.resolve(<ReactMarkdown source={markdown} />)
        }
        paste={{
          saveImage: saveImage,
        }}
      />
    </Stack>
  );
}
