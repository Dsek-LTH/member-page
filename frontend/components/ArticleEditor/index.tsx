import React from 'react';
import { useTranslation } from 'next-i18next';
import { articleEditorStyles } from './articleEditorStyles'
import "react-mde/lib/styles/css/react-mde-all.css";
import { Box, Tab, Tabs } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { LoadingButton, TabContext, TabPanel } from '@material-ui/lab';
import { MutationFunctionOptions } from '@apollo/client';
import ArticleEditorItem from './ArticleEditorItem';

type translationObject = {
    sv: string,
    en: string
}

type EditorProps = {
    header: translationObject,
    onHeaderChange: (translationObject: translationObject) => void
    body: translationObject
    onBodyChange: (translationObject: translationObject) => void
    selectedTab: "write" | "preview",
    onTabChange: (tab: "write" | "preview") => void,
    onImageChange: (string: File) => void,
    imageName: string,
    loading: boolean,
    onSubmit: (options?: MutationFunctionOptions) => void,
    saveButtonText: string,
}

export default function ArticleEditor({
    header,
    onHeaderChange,
    body,
    onBodyChange,
    selectedTab,
    onTabChange,
    onImageChange,
    imageName,
    loading,
    onSubmit,
    saveButtonText,
}: EditorProps) {
    const classes = articleEditorStyles();

    const { t } = useTranslation(['common', 'news']);

    const handleHeaderChange = (event: React.ChangeEvent<HTMLInputElement>, tag:string) => {
        onHeaderChange({
            ...header,
            [tag]: event.target.value,
        });
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onImageChange(event.target.files[0]);
    }

    const handleBodyChange = (value: string, tag:string) => {
        onBodyChange({
            ...body,
            [tag]: value,
        });
    };

    const [value, setValue] = React.useState("sv");

    const handleTabChange = (event: React.SyntheticEvent, newTab: string) => {
        setValue(newTab);
    };

    return (
        <Box
            component="form"
            noValidate
            autoComplete="off"
        >
            <TabContext value={value}>
                <Tabs
                    value={value}
                    onChange={handleTabChange}
                    textColor="primary"
                    indicatorColor="primary"
                    aria-label="secondary tabs example"
                >
                    <Tab value="sv" label={t('swedish')} />
                    <Tab value="en" label={t('english')} />
                </Tabs>

                <TabPanel value="sv">
                    <ArticleEditorItem
                        header={header.sv}
                        body={body.sv}
                        selectedTab={selectedTab}
                        onTabChange={onTabChange}
                        onHeaderChange={(event) => handleHeaderChange(event, "sv")}
                        onBodyChange={(value) => handleBodyChange(value, "sv")}
                        onImageChange={handleImageChange}
                        imageName={imageName}
                    />
                </TabPanel>
                <TabPanel value="en">
                    <ArticleEditorItem
                        header={header.en}
                        body={body.en}
                        selectedTab={selectedTab}
                        onTabChange={onTabChange}
                        onHeaderChange={(event) => handleHeaderChange(event, "en")}
                        onBodyChange={(value) => handleBodyChange(value, "en")}
                        onImageChange={handleImageChange}
                        imageName={imageName}
                    />
                </TabPanel>
            </TabContext>

            <LoadingButton
                loading={loading}
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="outlined"
                onClick={() => {
                    onSubmit()
                }}
            >
                {saveButtonText}
            </LoadingButton>

        </Box>
    )
}