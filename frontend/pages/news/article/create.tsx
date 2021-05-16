import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useCreateArticleMutation } from '../../../generated/graphql';
import { useRouter } from 'next/router'
import ArticleLayout from '../../../layouts/articleLayout';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import ArticleEditor from '~/components/ArticleEditor';
import Paper from '@material-ui/core/Paper';
import { commonPageStyles } from '~/styles/commonPageStyles'
import { Typography } from '@material-ui/core';
import UserContext from '~/providers/UserProvider';
import ArticleEditorSkeleton from '~/components/ArticleEditor/ArticleEditorSkeleton';
import ErrorSnackbar from '~/components/Snackbars/ErrorSnackbar';
import SuccessSnackbar from '~/components/Snackbars/SuccessSnackbar';
import putFile from '~/functions/putFile';
import { v4 as uuidv4 } from 'uuid';
import * as FileType from 'file-type/browser'

export default function CreateArticlePage() {
    const router = useRouter()
    const { keycloak, initialized } = useKeycloak<KeycloakInstance>();

    const { user, loading: userLoading } = useContext(UserContext);

    const { t } = useTranslation(['common', 'news']);
    const classes = commonPageStyles();

    const [selectedTab, setSelectedTab] = React.useState<'write' | 'preview'>('write');
    const [body, setBody] = React.useState({ sv: "", en: "" });
    const [header, setHeader] = React.useState({ sv: "", en: "" });
    const [imageFile, setImageFile] = React.useState<File | undefined>(undefined);
    const [imageName, setImageName] = React.useState('');
    const [successOpen, setSuccessOpen] = React.useState(false);
    const [errorOpen, setErrorOpen] = React.useState(false);
    const [createArticleMutation, { data, loading, error, called }] = useCreateArticleMutation({
        variables: {
            header: header.sv,
            body: body.sv,
            headerEn: header.en,
            bodyEn: body.en,
            imageName: imageName
        },
    });

    const submit = async () => {
        let fileType = undefined;
        if(imageFile){
          fileType = await FileType.fromBlob(imageFile);
          setImageName(`public/${uuidv4()}.${fileType.ext}`);
        }
    
        const data = await createArticleMutation();
        if(imageFile){
          putFile(data.data.article.create.uploadUrl, imageFile, fileType.mime);
        }
      }

    useEffect(() => {
        if (!loading && called) {
            if (error) {
                setErrorOpen(true);
                setSuccessOpen(false);
            }
            else {
                setErrorOpen(false);
                setSuccessOpen(true);
            }
        }
        else {
            setSuccessOpen(false);
            setErrorOpen(false);
        }

    }, [loading]);


    if (!initialized || userLoading) {
        return (
            <ArticleLayout>
                <Paper className={classes.innerContainer}>
                    <ArticleEditorSkeleton />
                </Paper>
            </ArticleLayout>
        )
    }


    if (!keycloak?.authenticated || !user) {
        return (
            <ArticleLayout>
                {t('notAuthenticated')}
            </ArticleLayout>
        );
    }

    return (
        <ArticleLayout>
            <Paper className={classes.innerContainer}>
                <Typography variant="h3" component="h1">
                    {t('news:createArticle')}
                </Typography>

                <SuccessSnackbar
                    open={successOpen}
                    onClose={setSuccessOpen}
                    message={t('edit_saved')}
                />

                <ErrorSnackbar
                    open={errorOpen}
                    onClose={setErrorOpen}
                    message={t('error')}
                />

                <ArticleEditor
                    header={header}
                    onHeaderChange={setHeader}
                    body={body}
                    onBodyChange={setBody}
                    selectedTab={selectedTab}
                    onTabChange={setSelectedTab}
                    loading={loading}
                    onSubmit={submit}
                    saveButtonText={t('save')}
                    onImageChange={(file: File) => {
                        setImageFile(file)
                        setImageName(file.name)
                    }}
                    imageName={imageName}
                />
            </Paper>
        </ArticleLayout >
    )
}

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...await serverSideTranslations(locale, ['common', 'news']),
        }
    }
}