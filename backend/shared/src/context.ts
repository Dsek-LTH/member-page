import { Language } from './language';

interface User {
  keycloak_id: string,
  student_id?: string,
  name?: string,
}

interface UserContext {
  user?: User,
  roles?: string[],
  language: Language,
}

interface ContextRequest {
  headers: {
    'x-user': string,
    'x-roles': string,
    'accept-language': string,
  }
}

const deserializeContext = ({ req }: {req: ContextRequest}): UserContext | undefined => {
  try {
    const user = JSON.parse(req.headers['x-user']);
    const roles = JSON.parse(req.headers['x-roles']);
    const language = req.headers['accept-language'] as Language;
    return { user, roles, language };
  } catch (e) {
    return undefined;
  }
};

export {
  User,
  UserContext,
  deserializeContext,
};
