import { DbMember, getMember } from './db';
import { UserContext } from '../../context';


export default {
  Query: {
    async me({}, {}, context: UserContext) {
      if (!context.user || !context.user.stil_id) return undefined;
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