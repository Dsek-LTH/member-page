import { getSignature } from '~/functions/authorFunctions';
import { Member } from '~/generated/graphql';
import routes from '~/routes';
import Link from '../Link';

export default function MemberSignature({ member, fontSize = '1rem' }: { member: Member,
  fontSize?: string }) {
  return (
    <Link
      href={routes.member(member.student_id)}
      style={{ fontSize, wordBreak: 'break-word' }}
    >
      {getSignature(member)}
    </Link>
  );
}
