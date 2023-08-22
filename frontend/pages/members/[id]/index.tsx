import {
  Box, Button, Paper, Stack, Tooltip,
} from '@mui/material';
import { i18n, useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import PortraitIcon from '@mui/icons-material/Portrait';
import Link from '~/components/Link';
import Member from '~/components/Members/Member';
import MemberSkeleton from '~/components/Members/MemberSkeleton';
import NoTitleLayout from '~/components/NoTitleLayout';
import genGetProps from '~/functions/genGetServerSideProps';
import { idOrStudentId } from '~/functions/isUUID';
import { getFullName } from '~/functions/memberFunctions';
import selectTranslation from '~/functions/selectTranslation';
import { useMemberPageQuery, usePingMemberMutation } from '~/generated/graphql';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import { useSetPageName } from '~/providers/PageNameProvider';
import UserContext from '~/providers/UserProvider';
import routes from '~/routes';
import commonPageStyles from '~/styles/commonPageStyles';

export default function MemberPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { user, loading: userLoading } = useContext(UserContext);
  const {
    loading,
    data: userData,
    refetch,
  } = useMemberPageQuery({
    variables: idOrStudentId(id),
  });
  const member = userData?.member;
  const classes = commonPageStyles();
  const { t } = useTranslation();
  const { hasAccess } = useApiAccess();
  const [ping] = usePingMemberMutation({
    variables: {
      id: member?.id,
    },
  });

  const MEMBER_TEXT = selectTranslation(i18n, 'Medlem', 'Member');
  const isMe = user?.id === member?.id;
  useSetPageName(
    member ? getFullName(member, false) : MEMBER_TEXT,
    isMe ? selectTranslation(i18n, 'Profil', 'Profile') : MEMBER_TEXT,
  );

  if (loading || userLoading) {
    return (
      <NoTitleLayout>
        <Paper className={classes.innerContainer}>
          <MemberSkeleton />
        </Paper>
      </NoTitleLayout>
    );
  }

  if (!member) {
    return <>{t('member:memberError')}</>;
  }
  return (
    <NoTitleLayout>
      <Paper className={classes.innerContainer}>
        <Member member={member} />
        <Stack
          direction="row"
          gap={2}
          marginTop={4}
          justifyContent="space-between"
          flexWrap="wrap"
        >
          {(member.id === user?.id || hasAccess('core:member:update')) && (
            <Stack direction="row" gap={2} flexWrap="wrap">
              <Link href={routes.editMember(member.id)}>
                <Button variant="contained" startIcon={<EditIcon />}>
                  {t('member:editMember')}
                </Button>
              </Link>
              <Link href={routes.changeProfilePicture(member.id)}>
                <Button startIcon={<PortraitIcon />}>
                  {t('member:changeProfilePicture')}
                </Button>
              </Link>
            </Stack>
          )}
          {hasAccess('core:member:ping')
            && (member.id !== user?.id ? (
              <Tooltip
                title={
                  !member.canPing
                    ? t('member:pingWaitForResponse')
                    : t('member:pingTooltip')
                }
              >
                <Box>
                  <Button
                    variant="outlined"
                    disabled={!member.canPing}
                    onClick={async () => {
                      await ping();
                      refetch();
                    }}
                    startIcon={<AdsClickIcon />}
                  >
                    {t('member:ping')}
                  </Button>
                </Box>
              </Tooltip>
            ) : (
              <Link href={routes.pings}>
                <Button startIcon={<AdsClickIcon />}>
                  {t('member:myPings')}
                </Button>
              </Link>
            ))}
        </Stack>
      </Paper>
    </NoTitleLayout>
  );
}

export const getServerSideProps = genGetProps(['member']);
