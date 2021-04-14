import React from 'react';
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import MemberLayout from '../../layouts/memberLayout';
import { useMemberPageQuery } from '../../generated/graphql';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import UserAvatar from '../../components/UserAvatar';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import SchoolIcon from '@material-ui/icons/School';


export default function MemberPage() {
  const router = useRouter()
  const id = router.query.slug as string;
  const { initialized } = useKeycloak<KeycloakInstance>();
  const { loading, data } = useMemberPageQuery({
    variables: { id: parseInt(id) ? parseInt(id) : 0 }
  });

  const { t } = useTranslation(['common', 'member']);

  if (loading || !initialized) {
    return (
      <MemberLayout>
          dsf
      </MemberLayout>
    )
  }

  const member = data?.member;

  if (!member) {
    return (
      <MemberLayout>
        {t('memberError')}
      </MemberLayout>
    );
  }
  const name = `${member.first_name} ${member.last_name}`;
  const classYear = `${member.class_programme}${member.class_year % 100}`;
  return (
    <MemberLayout>
        <Card>
          <CardContent>
            <UserAvatar src={member.picture_path} size={36}/>
            <Typography variant='h4'> {name} </Typography>
            <Typography variant='subtitle1' gutterBottom>{member.student_id}</Typography>
            <List component="div">
              <ListItem>
                  <ListItemIcon>
                    <SchoolIcon />
                  </ListItemIcon>
                <ListItemText primary={classYear} />
              </ListItem>
            </List>
          </CardContent>
        </Card>
    </MemberLayout >
  )
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...await serverSideTranslations(locale, ['common', 'member']),
    }
  }
}