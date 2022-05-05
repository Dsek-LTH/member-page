import { useEffect, useState } from 'react';
import { Button, Stack, TextField, Chip } from '@mui/material';
import { useKeycloak } from '@react-keycloak/ssr';
import {
  postOrder,
  IMenuItem,
  fetchMenu,
  postMenuItem,
} from '~/functions/ordersApi';

function AvailableOrders({ refetch }) {
  const { keycloak } = useKeycloak();
  const [menu, setMenu] = useState<IMenuItem[]>([]);
  const [orders, setOrders] = useState<string[]>([]);
  const [newMenuItemName, setNewMenuItemName] = useState('');
  useEffect(() => {
    fetchMenu().then((data) => {
      setMenu(data);
    });
  }, []);

  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" spacing={1}>
        <TextField
          label="Name"
          value={newMenuItemName}
          onChange={(e) => setNewMenuItemName(e.target.value)}
        />
        <Button
          onClick={() => {
            postMenuItem(newMenuItemName, keycloak.token).then(() => {
              fetchMenu().then((data) => {
                setMenu(data);
              });
            });
          }}
          disabled={!newMenuItemName}
          variant="contained"
        >
          Lägg till i menyn
        </Button>
      </Stack>
      <Stack direction="row" spacing={1} marginBottom={2}>
        {menu.map((menuItem) => (
          <Button
            key={menuItem.name}
            variant="outlined"
            onClick={() => {
              const newOrders = [...orders];
              newOrders.push(menuItem.name);
              setOrders(newOrders);
            }}
          >
            {menuItem.name}
          </Button>
        ))}
      </Stack>
      <Stack direction="row" spacing={1}>
        {orders.map((order, index) => (
          <Chip
            label={order}
            // eslint-disable-next-line react/no-array-index-key
            key={`${order}${index}`}
            onDelete={() => {
              const newOrders = [...orders];
              newOrders.splice(index, 1);
              setOrders(newOrders);
            }}
          />
        ))}
      </Stack>
      <Stack direction="row">
        <Button
          onClick={() => {
            if (keycloak.token) {
              postOrder(orders, keycloak.token).then(() => {
                refetch();
                setOrders([]);
              });
            } else {
              window.alert('Du måste vara inloggad!');
            }
          }}
          disabled={orders.length === 0}
          variant="contained"
        >
          Lägg till beställning
        </Button>
      </Stack>
    </Stack>
  );
}

export default AvailableOrders;
