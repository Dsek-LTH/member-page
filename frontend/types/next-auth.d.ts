// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a
   * prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      name: string;
      preferred_username: string;
      given_name: string;
      family_name: string;
    }
    accessToken?: string;
    idToken?: string;
  }
}
