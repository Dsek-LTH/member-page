export interface IOrder {
  id: number;
  orders: string[];
  isDone: boolean;
}

export interface IMenuItem {
  name: string;
  imageUrl?: string;
}

const URL = 'https://dsek-order-app.herokuapp.com';
// const URL = 'http://localhost:3001';

export const fetchAllOrders = async () => {
  const response = await fetch(`${URL}/orders`);
  const orders = (await response.json()) as IOrder[];
  const data = {
    unfinishedOrders: orders.filter((order) => !order.isDone),
    finishedOrders: orders.filter((order) => order.isDone),
  };
  return data;
};

export const fetchMenu = async () => {
  const response = await fetch(`${URL}/menu`);
  const menu = (await response.json()) as IMenuItem[];
  return menu;
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

export const postMenuItem = (name: String, token: string) =>
  fetch(`${URL}/menuItem`, {
    method: 'POST',
    body: JSON.stringify({ name }),
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
    body: JSON.stringify({ id }),
    headers: {
      AUTHORIZATION: `BEARER ${token}`,
      'Content-Type': 'application/json',
    },
  });
