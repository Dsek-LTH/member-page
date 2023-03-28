import React from 'react';
import { useTranslation } from 'next-i18next';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import { Stack } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import SchoolIcon from '@mui/icons-material/School';
import { Box } from '@mui/system';
import UserAvatar from '../UserAvatar';
import { MemberPageQueryResult } from '~/generated/graphql';
import { getClassYear, getFullName } from '~/functions/memberFunctions';
import selectTranslation from '~/functions/selectTranslation';
import Link from '~/components/Link';

export default function Member({
  member,
}: {
  member: MemberPageQueryResult['data']['member'];
}) {
  const { i18n } = useTranslation();
  const yearsActive = Array.from(new Set(
    member.mandates.map((mandate) => new Date(mandate.start_date).getFullYear()),
  )).sort();
  const structuredMandates = yearsActive.map((year) => {
    const mandates = [...member.mandates]
      .filter((mandate) => new Date(mandate.start_date).getFullYear() === year);
    return {
      year,
      mandates,
    };
  });
  const emailAliases = member.activeMandates?.map((mandate) => ({ ...mandate.position }));
  return (
    <Grid
      container
      spacing={3}
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
    >
      <Grid item xs={12} sm={12} md={12} lg={8}>
        <Typography variant="h4" style={{ wordBreak: 'break-word' }}>{getFullName(member, true, true)}</Typography>
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
          {emailAliases.length > 0 && (
            <Box display="grid" gridTemplateColumns="auto 1fr" columnGap={2}>
              {emailAliases.map((emailAlias) => (
                emailAlias.emailAliases.map((alias) => (
                  <>
                    <Box gridColumn="span 1">
                      <Link href={`mailto:${alias}`}>
                        {alias}
                      </Link>
                    </Box>
                    <Box gridColumn="span 1">
                      {selectTranslation(
                        i18n,
                        emailAlias.name,
                        emailAlias.nameEn,
                      )}
                    </Box>
                  </>
                ))))}
            </Box>
          )}
          {structuredMandates.map((mandateCategory) => (
            <Stack key={`mandate-categegory${mandateCategory.year}`} style={{ marginTop: '1rem' }}>
              <Typography variant="h5" color="primary">{mandateCategory.year}</Typography>
              {mandateCategory.mandates.map((mandate) => (
                <Typography key={mandate.id} style={{ marginTop: '0.5rem', marginLeft: '0.5rem' }}>
                  {selectTranslation(
                    i18n,
                    mandate.position.name,
                    mandate.position.nameEn,
                  )}
                </Typography>
              ))}
            </Stack>
          ))}
        </List>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={4}>
        <UserAvatar centered src={member.picture_path} size={36} />
      </Grid>
    </Grid>
  );
}
