import {
  Box,
  Button, Paper, Stack, Tooltip,
} from '@mui/material';
import { i18n, useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useContext } from 'react';
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
  const { loading, data: userData, refetch } = useMemberPageQuery({
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
    isMe
      ? selectTranslation(i18n, 'Profil', 'Profile')
      : MEMBER_TEXT,
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
        <Member
          member={member}
        />
        <Stack direction="row" spacing={2} marginTop={1}>
          {hasAccess('core:member:ping') && member.id !== user?.id && (
            <Tooltip title={!member.canPing ? t('member:pingWaitForResponse') : t('member:pingTooltip')}>
              <Box>
                <Button
                  variant="contained"
                  disabled={!member.canPing}
                  onClick={async () => {
                    await ping();
                    refetch();
                  }}
                >
                  {t('member:ping')}
                </Button>
              </Box>
            </Tooltip>
          )}
          {(member.id === user?.id || hasAccess('core:member:update')) && (
          <>
            <Link href={routes.editMember(member.id)}>
              <Button>{t('member:editMember')}</Button>
            </Link>
            <Link href={routes.changeProfilePicture(member.id)}>
              <Button>
                {t('member:changeProfilePicture')}
              </Button>
            </Link>
          </>
          )}
        </Stack>
      </Paper>
    </NoTitleLayout>
  );
}

export const getServerSideProps = genGetProps(['member']);
