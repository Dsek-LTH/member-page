import { DbMember, getMember } from './db';
import { context } from 'dsek-shared';


export default {
  Query: {
    async me({}, {}, context: context.UserContext) {
      if (!context.user?.stil_id) return undefined;
      const me = await getMember(context.user.stil_id);
      return me;
    }
  },
  Member: {
    async __resolveReference(member: DbMember) {
      return await getMember(member.stil_id);
    }
  }
};