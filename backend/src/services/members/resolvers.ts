import { IDbMember, getMember } from './db';
import { UserContext } from '../../context';


export default {
  Query: {
    async me({}, {}, context: UserContext) {
      if (!context.user) return undefined;
      const me = await getMember(context.user.stil_id || '');
      return me;
    }
  },
  Member: {
    async __resolveReference(member: IDbMember) {
      return await getMember(member.stil_id);
    }
  }
};