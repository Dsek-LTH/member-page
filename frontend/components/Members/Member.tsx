import React from 'react';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import { Stack } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import SchoolIcon from '@mui/icons-material/School';
import UserAvatar from '../UserAvatar';
import { MemberPageQueryResult } from '~/generated/graphql';
import { getClassYear, getFullName } from '~/functions/memberFunctions';
import selectTranslation from '~/functions/selectTranslation';

export default function Member({
  member,
}: {
  member: MemberPageQueryResult['data']['memberById'];
}) {
  const { i18n, t } = useTranslation();
  return (
    <Grid
      container
      spacing={3}
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
    >
      <Grid item xs={12} sm={12} md={12} lg={8}>
        <Typography variant="h4">{getFullName(member)}</Typography>
        <Typography variant="subtitle1" gutterBottom>
          {member.student_id}
        </Typography>
        <List>
          <ListItem style={{ paddingLeft: 0 }}>
            <Stack direction="row" spacing={2}>
              <SchoolIcon />
              <ListItemText primary={getClassYear(member)} />
            </Stack>
          </ListItem>
          {member.mandates.map((mandate) => (
            <ListItem style={{ paddingLeft: 0 }} key={mandate.id}>
              <ListItemText
                primary={`${selectTranslation(
                  i18n,
                  mandate.position.name,
                  mandate.position.nameEn,
                )} ${mandate.start_date.toString()} ${t('to')} ${mandate.end_date.toString()}`}
              />
            </ListItem>
          ))}
        </List>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={4}>
        <UserAvatar centered src={member.picture_path} size={36} />
      </Grid>
    </Grid>
  );
}
