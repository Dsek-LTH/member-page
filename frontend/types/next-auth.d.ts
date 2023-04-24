// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `Provider` React Context
   */
  interface Session {
    user: {
      sub: string;
      email_verified: boolean;
      name: string;
      preferred_username: string;
      studentId: string;
      firstName: string;
      lastName: string;
      email: string;
      id: string;
      org_name?: string;
      telephone?: string;
    };
    error: string;
    idToken: string;
    accessToken: string;
    refreshToken: string;
  }
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {
    sub: string;
    email_verified: boolean;
    name: string;
    telephone: string;
    preferred_username: string;
    org_name: string;
    given_name: string;
    family_name: string;
    email: string;
    id: string;
  }
  /**
   * Usually contains information about the provider being used
   * and also extends `TokenSet`, which is different tokens returned by OAuth Providers.
   */
  interface Account {
    provider: string;
    type: string;
    id: string;
    accessToken: string;
    accessTokenExpires?: any;
    refreshToken: string;
    idToken: string;
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    refresh_token: string;
    token_type: string;
    id_token: string;
    'not-before-policy': number;
    session_state: string;
    scope: string;
  }
  /** The OAuth profile returned from your provider */
  interface Profile {
    sub: string;
    email_verified: boolean;
    name: string;
    telephone: string;
    preferred_username: string;
    org_name: string;
    given_name: string;
    family_name: string;
    email: string;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    name: string;
    email: string;
    sub: string;
    name: string;
    email: string;
    sub: string;
    accessToken: string;
    idToken: string;
    refreshToken: string;
    expiresAt: number;
    given_name: string;
    family_name: string;
    preferred_username: string;
    user: User;
    error: string;
  }
}
