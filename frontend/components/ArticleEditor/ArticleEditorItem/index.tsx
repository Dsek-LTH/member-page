import React from 'react';
import { useTranslation } from 'next-i18next';
//@ts-ignore package does not have typescript types
import ReactMde from 'react-mde';
import "react-mde/lib/styles/css/react-mde-all.css";
import ReactMarkdown from 'react-markdown';
import { Button, Input, Stack, Tab, Tabs, TextField } from '@material-ui/core';
import { articleEditorItemStyles } from './articleEditorItemStyles';

type EditorProps = {
    header: string,
    body: string,
    selectedTab: "write" | "preview",
    onTabChange: (tab: "write" | "preview") => void,
    onHeaderChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onBodyChange: (value: string) => void
}

export default function ArticleEditorItem({
    header,
    body,
    selectedTab,
    onTabChange,
    onHeaderChange,
    onBodyChange,
}: EditorProps) {
    const classes = articleEditorItemStyles();

    const { t } = useTranslation(['common', 'news']);

    return (
        <Stack spacing={2} >
            <TextField
                id="header-field"
                label={t('news:header')}
                onChange={onHeaderChange}
                multiline
                value={header} />

            <label htmlFor="contained-button-file">
                <Input id="contained-button-file" type="file" />
                <Button variant="outlined" component="span" className={classes.uploadButton}>
                    {t('upload')}
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
            />
        </Stack>
    )
}