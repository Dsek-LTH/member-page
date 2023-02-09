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
      studentId: string;
      firstName: string;
      lastName: string;
      email: string;
    }
    accessToken?: string;
    idToken?: string;
  }

  interface Profile {
    given_name: string;
    family_name: string;
    preferred_username: string;
  }
}
