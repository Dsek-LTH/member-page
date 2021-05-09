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

export default function CreateArticlePage() {
    const router = useRouter()
    const { keycloak, initialized } = useKeycloak<KeycloakInstance>();

    const { user, loading: userLoading } = useContext(UserContext);

    const { t } = useTranslation(['common', 'news']);
    const classes = commonPageStyles();

    const [selectedTab, setSelectedTab] = React.useState<'write' | 'preview'>('write');
    const [body, setBody] = React.useState({ sv: "", en: "" });
    const [header, setHeader] = React.useState({ sv: "", en: "" });
    const [successOpen, setSuccessOpen] = React.useState(false);
    const [errorOpen, setErrorOpen] = React.useState(false);
    const [createArticleMutation, { data, loading, error, called }] = useCreateArticleMutation({
        variables: {
            header: header.sv,
            body: body.sv,
            headerEn: header.en,
            bodyEn: body.en
        },
    });

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
                <ArticleEditorSkeleton />
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
                    onSubmit={createArticleMutation}
                    saveButtonText={t('save')}
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