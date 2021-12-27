export type DecodedKeycloakToken = {
  jti: string;
  exp: number;
  nbf: number;
  iat: number;
  iss: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
  group: string[];
};
