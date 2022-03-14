export interface IOrder {
  id: number;
  orders: string[];
  isDone: boolean;
}

const URL = 'https://dsek-order-app.herokuapp.com';

export const fetchAllOrders = async () => {
  const response = await fetch(`${URL}/orders`);
  const orders = (await response.json()) as IOrder[];
  const data = {
    unfinishedOrders: orders.filter((order) => !order.isDone),
    finishedOrders: orders.filter((order) => order.isDone),
  };
  return data;
};

export const postOrder = (orders: string[], token: string) =>
  fetch(`${URL}/order`, {
    method: 'POST',
    body: JSON.stringify({ orders }),
    headers: {
      Authorization: `BEARER ${token}`,
      'Content-Type': 'application/json',
    },
  });

export const setOrderDone = (id: number, token: string) =>
  fetch(`${URL}/order/done`, {
    method: 'PUT',
    body: JSON.stringify({ id }),
    headers: {
      Authorization: `BEARER ${token}`,
      'Content-Type': 'application/json',
    },
  });

export const deleteOrder = (id: number, token: string) =>
  fetch(`${URL}/order`, {
    method: 'DELETE',
    body: JSON.stringify({ body: { id } }),
    headers: {
      AUTHORIZATION: `BEARER ${token}`,
      'Content-Type': 'application/json',
    },
  });
