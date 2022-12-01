import 'mocha';
import { expect } from 'chai';
import { getRoleNames } from '~/src/keycloak';

describe('getRoleNames', () => {
  it('should return the correct role names for a position', () => {
    const positionId = 'dsek.sexm.kok.mastare';
    const result = getRoleNames(positionId);
    expect(result).to.deep.equal(['dsek', 'dsek.sexm', 'dsek.sexm.kok', 'dsek.sexm.kok.mastare']);
  });
});
