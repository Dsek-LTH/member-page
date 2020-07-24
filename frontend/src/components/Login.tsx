import React from 'react';
import { withKeycloak } from '@react-keycloak/web'
import {Button} from '@material-ui/core';
import Keycloak from 'keycloak-js';


interface LoginProps {
  keycloak: Keycloak.KeycloakInstance,
  keycloakInitialized: boolean
}

const Login : React.FC<LoginProps> = ({ keycloak, keycloakInitialized }) => {
  return (
    <div>
      {!keycloak.authenticated &&
        <Button color="inherit" onClick={() => keycloak.login()}>Logga in</Button>
      }
      {keycloak.authenticated &&
        <Button color="inherit" onClick={() => keycloak.logout()}>Logga ut</Button>
      }
    </div>
  )
}

export default withKeycloak(Login)