import React, {
  ChangeEvent, useCallback, useContext, useState,
} from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import { Button, Paper, Stack } from '@mui/material';
import { useMemberPageQuery } from '~/generated/graphql';
import Member from '~/components/Members/Member';
import MemberSkeleton from '~/components/Members/MemberSkeleton';
import routes from '~/routes';
import commonPageStyles from '~/styles/commonPageStyles';
import UserContext from '~/providers/UserProvider';
import NoTitleLayout from '~/components/NoTitleLayout';

export default function MemberPage() {
  const [uploadImage, setUploadImage] = useState('');
  const router = useRouter();
  const id = router.query.id as string;
  const { initialized } = useKeycloak<KeycloakInstance>();
  const { user, loading: userLoading } = useContext(UserContext);
  const { loading, data: memberData } = useMemberPageQuery({
    variables: { id },
  });
  const classes = commonPageStyles();
  const { t } = useTranslation();

  const uploadProfilePicture = useCallback((
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files[0];
    const body = new FormData();
    body.append('file', file);
    body.append('upload_preset', 'profile_picture');
    fetch('https://api.cloudinary.com/v1_1/dsek/upload', {
      method: 'post',
      body,
    }).then((res) => res.json()).then((data) => {
      setUploadImage(data.secure_url);
    });
  }, []);

  if (loading || !initialized || userLoading) {
    return (
      <NoTitleLayout>
        <Paper className={classes.innerContainer}>
          <MemberSkeleton />
        </Paper>
      </NoTitleLayout>
    );
  }

  const member = memberData?.memberById;

  if (!member) {
    return <>{t('member:memberError')}</>;
  }
  return (
    <NoTitleLayout>
      <Paper className={classes.innerContainer}>
        <Member
          member={member}
        />
        {member.id === user?.id && (
          <Stack direction="row">
            <Button href={routes.editMember(id)}>{t('member:editMember')}</Button>
            <Button
              component="label"
            >
              Ladda upp profilbild
              <input
                onChange={(event) => {
                  uploadProfilePicture(event);
                }}
                type="file"
                hidden
              />
            </Button>
          </Stack>
        )}
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
