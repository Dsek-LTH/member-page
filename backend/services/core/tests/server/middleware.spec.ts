import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import middleware from '~/src/middleware';
import { DecodedToken } from '~/src/verifyAndDecodeToken';

const decodedToken: DecodedToken = {
  sub: '123',
  preferred_username: 'ab1556ci-s',
  name: 'Abrian Cider',
  group: ['dsek.infu.dwww.mastare'],
  aud: ['account'],
  exp: 0,
  iat: 0,
  iss: 'https://portal.dsek.se/auth/realms/dsek',
};

chai.use(spies);

const sandbox = chai.spy.sandbox();

describe('Song API Graphql Queries', () => {
  beforeEach(() => {
    chai.spy.on(middleware, 'createContext');
  });

  afterEach(() => {
    chai.spy.restore(middleware);
    sandbox.restore();
  });

  describe('middleware.createContext', () => {
    it('create a context with invalid bearer token', async () => {
      chai.spy.on(middleware, 'verifyAndDecodeToken');
      const context = await middleware.createContext({ req: { headers: { authorization: 'Bearer abc' } } });
      expect(middleware.createContext).to.have.been.called();
      expect(middleware.verifyAndDecodeToken).to.have.been.called.with('abc');
      expect(context).to.be.undefined;
    });

    it('create a context with verifyAndDecodeToken sandbox', async () => {
      sandbox.on(middleware, 'verifyAndDecodeToken', () => Promise.resolve(decodedToken));
      const context = await middleware.createContext({ req: { headers: { authorization: 'Bearer abc' } } });
      expect(middleware.createContext).to.have.been.called();
      expect(middleware.verifyAndDecodeToken).to.have.been.called.with('abc');
      expect(context).to.deep.equal({
        user: {
          keycloak_id: '123',
          student_id: 'ab1556ci-s',
          name: 'Abrian Cider',
        },
        roles: ['dsek', 'dsek.infu', 'dsek.infu.dwww', 'dsek.infu.dwww.mastare'],
      });
    });

    it('simulate a request with a mutation', async () => {
      sandbox.on(middleware, 'verifyAndDecodeToken', () => Promise.resolve(decodedToken));
      const context = await middleware.createContext({
        req: {
          headers: { authorization: 'Bearer abc' },
          body: {
            query: 'mutation: { ... }',
            operationName: 'createSong',
            variables: {
              title: 'test', artist: 'test', album: 'test', year: 2020,
            },
          },
        },
      });
      expect(middleware.createContext).to.have.been.called();
      expect(middleware.verifyAndDecodeToken).to.have.been.called.with('abc');
      expect(context).to.deep.equal({
        user: {
          keycloak_id: '123',
          student_id: 'ab1556ci-s',
          name: 'Abrian Cider',
        },
        roles: ['dsek', 'dsek.infu', 'dsek.infu.dwww', 'dsek.infu.dwww.mastare'],
      });
    });
  });
});
