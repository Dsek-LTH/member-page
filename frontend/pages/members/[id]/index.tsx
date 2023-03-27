import { Button, Paper, Stack } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import Link from '~/components/Link';
import Member from '~/components/Members/Member';
import MemberSkeleton from '~/components/Members/MemberSkeleton';
import NoTitleLayout from '~/components/NoTitleLayout';
import genGetProps from '~/functions/genGetServerSideProps';
import { idOrStudentId } from '~/functions/isUUID';
import { useMemberPageQuery } from '~/generated/graphql';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import UserContext from '~/providers/UserProvider';
import routes from '~/routes';
import commonPageStyles from '~/styles/commonPageStyles';

export default function MemberPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { user, loading: userLoading } = useContext(UserContext);
  const { loading, data: userData } = useMemberPageQuery({
    variables: idOrStudentId(id),
  });
  const classes = commonPageStyles();
  const { t } = useTranslation();
  const { hasAccess } = useApiAccess();

  if (loading || userLoading) {
    return (
      <NoTitleLayout>
        <Paper className={classes.innerContainer}>
          <MemberSkeleton />
        </Paper>
      </NoTitleLayout>
    );
  }
  const member = userData?.member;

  if (!member) {
    return <>{t('member:memberError')}</>;
  }
  return (
    <NoTitleLayout>
      <Paper className={classes.innerContainer}>
        <Member
          member={member}
        />
        {(member.id === user?.id || hasAccess('core:member:update')) && (
          <Stack direction="row" spacing={2} marginTop={1}>
            <Link href={routes.editMember(member.id)}>
              <Button>{t('member:editMember')}</Button>
            </Link>
            <Link href={routes.changeProfilePicture(member.id)}>
              <Button>
                {t('member:changeProfilePicture')}
              </Button>
            </Link>
          </Stack>
        )}
      </Paper>
    </NoTitleLayout>
  );
}

export const getServerSideProps = genGetProps(['member']);
