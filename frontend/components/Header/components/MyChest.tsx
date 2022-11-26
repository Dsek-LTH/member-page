import { Badge, IconButton } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory'; import Link from 'next/link';
import { useMyChestQuery } from '~/generated/graphql';
import routes from '~/routes';
import { useUser } from '~/providers/UserProvider';

export default function MyChest() {
  const { user } = useUser();
  const { data } = useMyChestQuery({ variables: { memberId: user?.id } });
  const length = data?.chest?.items.length || 0;
  if (length === 0) return null;
  return (
    <Link href={routes.memberChest(user?.id)} passHref>
      <IconButton>
        <Badge badgeContent={length} color="secondary">
          <InventoryIcon />
        </Badge>
      </IconButton>
    </Link>
  );
}
