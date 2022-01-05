interface User {
  keycloak_id: string,
  student_id?: string,
  name?: string,
}

interface UserContext {
  user?: User,
  roles?: string[],
  language?: string,
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
    const user = (req.headers['x-user']) ? JSON.parse(req.headers['x-user']) : undefined;
    const roles = (req.headers['x-roles']) ? JSON.parse(req.headers['x-roles']) : undefined;
    const language = (req.headers['accept-language']) ? req.headers['accept-language'] : 'en';
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
