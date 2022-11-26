import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import {
  Avatar, Paper, Stack,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { LoadingButton } from '@mui/lab';
import { ApolloError } from '@apollo/client';
import path from 'path';
import {
  FileData,
  useFilesQuery,
  useMemberPageQuery,
  usePresignedPutUrlQuery,
  useRemoveMyProfilePictureMutation,
  useUpdateMemberMutation,
} from '~/generated/graphql';
import MemberSkeleton from '~/components/Members/MemberSkeleton';
import commonPageStyles from '~/styles/commonPageStyles';
import { useUser } from '~/providers/UserProvider';
import NoTitleLayout from '~/components/NoTitleLayout';
import putFile from '~/functions/putFile';
import { useSnackbar } from '~/providers/SnackbarProvider';
import resizeProfilePicture from '~/functions/resizeProfilePicture';
import routes from '~/routes';
import { useApiAccess } from '~/providers/ApiAccessProvider';

const bucket = 'members';

function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function MemberPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { initialized } = useKeycloak<KeycloakInstance>();
  const { refetch: refetchMe, user } = useUser();
  const { loading, data: userData } = useMemberPageQuery({
    variables: { id },
  });
  const prefix = `public/${userData?.member?.student_id}/`;
  const classes = commonPageStyles();
  const { t } = useTranslation();
  const [uploadingFile, setUploadingFile] = useState(false);
  const [newProfilePicture, setNewProfilePicture] = useState<File>(undefined);
  const [selectedProfilePicture, setSelectedProfilePicture] = useState<FileData>(null);
  const { refetch: fetchPutUrl } = usePresignedPutUrlQuery({ variables: { bucket, fileName: '' } });
  const { data: profilePictures, refetch: refetchFiles } = useFilesQuery({ variables: { bucket: 'members', prefix } });
  const [updateUserData] = useUpdateMemberMutation({
    variables: {
      id,
      picturePath: selectedProfilePicture?.thumbnailUrl,
    },
  });
  const [removeProfilePicture] = useRemoveMyProfilePictureMutation({
    variables: {
      fileName: selectedProfilePicture?.id,
    },
  });
  const [loadingUpdateMember, setLoadingUpdateMember] = useState(false);
  const [loadingRemoveProfilePicture, setLoadingRemoveProfilePicture] = useState(false);
  const { showMessage } = useSnackbar();
  const { hasAccess } = useApiAccess();

  useEffect(() => {
    setSelectedProfilePicture(profilePictures?.files
      .find((file) => file.thumbnailUrl === userData?.member?.picture_path));
  }, [userData]);

  useEffect(() => {
    async function uploadFile() {
      setUploadingFile(true);
      const fileName = `${prefix}${newProfilePicture?.name}`;
      const ext = path.extname(fileName);
      const randomizedFileName = `${path.dirname(fileName)}/${path.basename(fileName, ext)}${randomIntFromInterval(1, 10000)}${ext}`;
      fetchPutUrl({ fileName: randomizedFileName }).then(async ({ data: { presignedPutUrl } }) => {
        const image = await resizeProfilePicture(newProfilePicture, randomizedFileName);
        await putFile(presignedPutUrl, image, image.type, showMessage, t);
        const { data: newFiles } = await refetchFiles();
        setNewProfilePicture(undefined);
        setSelectedProfilePicture(newFiles?.files
          .find((file) => file.id.includes(randomizedFileName)));
      })
        .catch((err: ApolloError) => {
          showMessage(err.message, 'error');
        }).finally(() => {
          setUploadingFile(false);
        });
    }
    if (newProfilePicture?.name) {
      uploadFile();
    }
  }, [newProfilePicture, fetchPutUrl, showMessage, t, prefix, refetchFiles]);

  if (loading || !initialized) {
    return (
      <NoTitleLayout>
        <Paper className={classes.innerContainer}>
          <MemberSkeleton />
        </Paper>
      </NoTitleLayout>
    );
  }

  const member = userData?.member;
  if (!member || (user?.id !== member.id && !hasAccess('core:member:update'))) {
    return <>{t('no_permission_page')}</>;
  }
  return (
    <NoTitleLayout>
      <Paper className={classes.innerContainer}>
        <Stack direction="row" flexWrap="wrap">
          {profilePictures?.files.map((profilePicture) => (
            <Avatar
              onClick={() => {
                setSelectedProfilePicture(profilePicture);
              }}
              style={{
                width: '10rem',
                height: '10rem',
                marginRight: '1rem',
                marginBottom: '1rem',
                border: profilePicture?.thumbnailUrl === selectedProfilePicture?.thumbnailUrl ? 'solid 4px pink' : '',
                cursor: 'pointer',
              }}
              src={profilePicture?.thumbnailUrl}
              key={profilePicture?.thumbnailUrl}
            />
          ))}
        </Stack>
        <Stack direction="row" spacing={2} marginTop={1}>
          <LoadingButton component="label" loading={uploadingFile}>
            <PhotoCamera style={{ marginRight: '0.5rem' }} />
            {t('member:uploadNewPicture')}
            <input
              hidden
              accept="image/*"
              type="file"
              onInput={(event) => {
                setNewProfilePicture(event.currentTarget.files[0]);
                // eslint-disable-next-line no-param-reassign
                event.currentTarget.value = null;
              }}
            />
          </LoadingButton>
          <LoadingButton
            loading={loadingRemoveProfilePicture}
            onClick={() => {
              setLoadingRemoveProfilePicture(true);
              removeProfilePicture().then(() => {
                setSelectedProfilePicture(null);
                refetchFiles();
              })
                .finally(() => {
                  setLoadingRemoveProfilePicture(false);
                });
            }}
            color="error"
            variant="contained"
            disabled={!selectedProfilePicture}
          >
            Ta bort bild
          </LoadingButton>
          <LoadingButton
            loading={loadingUpdateMember}
            onClick={() => {
              setLoadingUpdateMember(true);
              updateUserData().then(() => {
                setLoadingUpdateMember(false);
                refetchMe().then(() => {
                  router.push(routes.member(userData?.member?.student_id));
                });
              });
            }}
            variant="contained"
            disabled={!selectedProfilePicture}
          >
            Spara
          </LoadingButton>
        </Stack>
      </Paper>
    </NoTitleLayout>
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'member'])),
    },
  };
}
