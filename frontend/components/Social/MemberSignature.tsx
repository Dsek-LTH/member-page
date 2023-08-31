import { Member } from '~/generated/graphql';
import routes from '~/routes';
import Link from '../Link';
import { getMemberSignature } from '~/functions/authorFunctions';

export default function MemberSignature({ member, fontSize = '1rem' }: { member: Member,
  fontSize?: string }) {
  return (
    <Link
      href={routes.member(member.student_id)}
      style={{ fontSize, wordBreak: 'break-word' }}
    >
      {getMemberSignature(member)}
    </Link>
  );
}
