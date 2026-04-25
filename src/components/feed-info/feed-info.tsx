import { FC, useEffect, useState } from 'react';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

// получаем список номеров заказов по статусу
const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [totalToday, setTotalToday] = useState(0);

  // данные для статистики
  useEffect(() => {
    const loadFeeds = async () => {
      try {
        const data = await getFeedsApi();
        setOrders(data.orders);
        setTotal(data.total);
        setTotalToday(data.totalToday);
      } catch (error) {
        console.error('Ошибка загрузки статистики:', error);
      }
    };
    loadFeeds();
  }, []);

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');
  const feed = { total, totalToday };

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
