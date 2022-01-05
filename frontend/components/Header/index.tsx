import React, { PropsWithChildren } from 'react';
import {
  Box,
  IconButton,
  Stack,
  Theme,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Link from 'next/link';
import { createStyles, makeStyles } from '@mui/styles';
import DsekIcon from '../Icons/DsekIcon';
import routes from '~/routes';
import SearchInput from './SearchInput';
import DarkModeSelector from './components/DarkModeSelector';
import LanguageSelector from './components/LanguageSelector';
import AuthenticationStatus from './AuthenticationStatus';

function Layout({ children }: PropsWithChildren<{}>) {
  const theme = useTheme();
  const hideSmall = useMediaQuery(theme.breakpoints.up('sm'));
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {hideSmall && <SearchInput />}
      <LanguageSelector />
      <DarkModeSelector />
      {children}
    </Stack>
  );
}

const useHeaderStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      margin: '0 -0.5rem',
    },
  }));

function Header() {
  const classes = useHeaderStyles();

  return (
    <Box className={classes.box}>
      <Link href={routes.root} passHref>
        <IconButton>
          <DsekIcon color="primary" style={{ fontSize: 48 }} />
        </IconButton>
      </Link>
      <Layout>
        <AuthenticationStatus />
      </Layout>
    </Box>
  );
}

export default Header;
