import { DbMember, getMember } from './db';
import { context } from 'dsek-shared';


export default {
  Query: {
    async me({}, {}, context: context.UserContext) {
      if (!context.user?.student_id) return getMember({student_id: 'dat15ewi'});
      const me = await getMember({student_id: context.user.student_id});
      return me;
    }
  },
  Member: {
    async __resolveReference(member: DbMember) {
      return await getMember({id: member.id});
    }
  }
};