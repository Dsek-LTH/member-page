import React from 'react';
import { KeycloakProvider } from '@react-keycloak/web';
import Keycloak from 'keycloak-js';

const keycloak : Keycloak.KeycloakInstance = Keycloak();

const LoginProvider: React.FC<{}> = ({children}) => {
  return (
    <KeycloakProvider keycloak={keycloak}>
      {children}
    </KeycloakProvider>
  )
}

export default LoginProvider;
