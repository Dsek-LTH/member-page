/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable class-methods-use-this */
import { getRoleNames } from './keycloak';
import { context, createLogger } from './shared';
import verifyAndDecodeToken from './verifyAndDecodeToken';

const logger = createLogger('middleware');

class ServerMiddleware {
  async verifyAndDecodeToken(token: string) {
    return verifyAndDecodeToken(token);
  }

  async createContext({ req }: { req: any }) {
    const authorization = req?.headers?.authorization;
    if (!authorization) return undefined;

    const token = authorization.split(' ')[1]; // Remove "Bearer" from token
    const decodedToken = await middleware.verifyAndDecodeToken(token);
    if (!decodedToken) return undefined;
    const c: context.UserContext = {
      user: {
        keycloak_id: decodedToken.sub,
        student_id: decodedToken.preferred_username,
        name: decodedToken.name,
      },
      roles: Array.from(new Set(decodedToken.group_list?.map((group) => getRoleNames(group)).join().split(',') ?? [])),
    };
    if (req?.body?.query?.includes('mutation')) {
      logger.log('info', `${c.user?.student_id} performed "${req.body.operationName}" with variables: ${JSON.stringify(req.body.variables)}`);
    }
    return c;
  }
}

const middleware = new ServerMiddleware();

export default middleware;
