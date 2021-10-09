import { useKeycloak } from "@react-keycloak/ssr";
import { KeycloakInstance } from "keycloak-js";
import { useRouter } from "next/router";
import { useContext } from "react";
import UserContext from "~/providers/UserProvider";

function UserExistingCheck({ children }) {

  const { keycloak, initialized } = useKeycloak<KeycloakInstance>();
  const { user, loading } = useContext(UserContext);
  const router = useRouter();

  if (!keycloak.authenticated) {
    return (
      <>
        {children}
      </>
    );
  }

  if (keycloak.authenticated && !loading && !user)
    router.push('/onboarding');
}

export default UserExistingCheck;