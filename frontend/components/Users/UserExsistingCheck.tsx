import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import UserContext from '~/providers/UserProvider';
import { LinearProgress, Box } from '@mui/material';
import routes from '~/routes';

function UserExistingCheck({ children }) {

  const { keycloak } = useKeycloak<KeycloakInstance>();
  const { user, loading } = useContext(UserContext);
  const router = useRouter();

  if (keycloak.authenticated && !loading && !user && router.pathname !== routes.onboarding)
    router.push(routes.onboarding);

  if (keycloak.authenticated && !user && router.pathname !== routes.onboarding)
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    );

  return children;
}

export default UserExistingCheck;