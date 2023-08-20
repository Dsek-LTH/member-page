import
{
  Box, Button, Card, CardActionArea, Grid, Stack, Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import SmallEventList from '~/components/App/SmallEventList';
import SmallNewsList from '~/components/App/SmallNewsList';
import navigationData from '~/components/Header/components/Navigation/data';
import SearchInput from '~/components/Header/SearchInput';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import { useUser } from '~/providers/UserProvider';
import routes from '~/routes';

const baseRoutes = ['committees', 'songs', 'cafe', 'booking', 'meetingDocuments', 'SRD', 'kravprofiler', 'policies', 'mandates', 'contact'];
const adminRoutes = ['doors', 'editApis', 'mailAlias', 'markdownsAdmin'];
const allNavRoutes = navigationData.items;
const getNavRoutes = (currentRoutes: typeof allNavRoutes, routesToShow) => {
  let savedRoutes: typeof allNavRoutes = [];
  currentRoutes.forEach((route) => {
    if (routesToShow.includes(route.translationKey)) {
      savedRoutes.push(route);
    }
    if (route.children) {
      savedRoutes = savedRoutes.concat(getNavRoutes(route.children, routesToShow));
    }
  });
  return savedRoutes.sort((a, b) => // sort in order of "routesToShow" array
    routesToShow.indexOf(a.translationKey)
- routesToShow.indexOf(b.translationKey));
};
const navRoutes = getNavRoutes(allNavRoutes, baseRoutes)
  .map((route) => { // add path to routes without it
    if (route.translationKey === 'documents') {
      return {
        ...route,
        path: '/documents',
      };
    }
    return route;
  });
const adminNavRoutes = getNavRoutes(allNavRoutes, adminRoutes);

function GridSquare({ children, link, icon }) {
  const router = useRouter();
  return (
    <Grid
      item
      xs={6}
    >
      <Box
        sx={{
          position: 'relative',
          '&::before': {
            display: 'block',
            content: "''",
            paddingBottom: '100%',
          },
        }}
      >
        <Card sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        >
          <CardActionArea
            sx={{
              width: '100%',
              height: '100%',
            }}
            onClick={() => {
              router.push(link);
            }}
          >
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            >
              <Box sx={{ height: 24 }} />
              <Box sx={{ transform: 'scale(2)' }}>{icon}</Box>
              <Box sx={{ height: 24, fontSize: '0.8em' }}>
                {children}
              </Box>

            </Box>
          </CardActionArea>
        </Card>

      </Box>

    </Grid>
  );
}

const GridSquaresFromRoutes = ({ pages }) => {
  const apiContext = useApiAccess();
  const { t } = useTranslation();
  return pages.map((page) => (
    page.hasAccess(apiContext) ? (
      <GridSquare key={page.translationKey} link={page.path} icon={page.icon}>
        {t(page.translationKey)}
      </GridSquare>
    ) : null
  ));
};

function AppLandingPage() {
  const { t } = useTranslation();
  const { hasAccess } = useApiAccess();
  const router = useRouter();
  const { user } = useUser();
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack gap={1}>
          <Button
            sx={(theme) => ({
              animation: 'pulse 1s infinite cubic-bezier(0.66, 0, 0, 1)',
              boxShadow: `0 0 0 0 ${theme.palette.primary.main}`,
              '@keyframes pulse': {
                to: {
                  boxShadow: '0 0 0 10px transparent',
                },
              },
            })}
            variant="contained"
            onClick={() => router.push(routes.nolla.home)}
          >
            {t('homePage:nollning')}
          </Button>
          <SmallNewsList />
          <SmallEventList />
        </Stack>
      </Grid>
      {user && (
      <Grid item xs={12}>
        <SearchInput
          fullWidth
          onSelect={(studentId) => {
            router.push(routes.member(studentId));
          }}
        />
      </Grid>
      )}
      <GridSquaresFromRoutes pages={navRoutes} />
      {hasAccess('core:access:admin:read') && (
        <Grid item xs={12}>
          <Typography variant="h6" align="center">
            {t('admin')}
          </Typography>
        </Grid>
      )}
      <GridSquaresFromRoutes pages={adminNavRoutes} />
    </Grid>
  );
}
export default AppLandingPage;
