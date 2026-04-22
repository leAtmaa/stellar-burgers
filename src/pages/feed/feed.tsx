import { FC, useState, useEffect } from 'react';
import { OrdersList } from '../../components/orders-list';
import { FeedInfo } from '../../components/feed-info';
import { RefreshButton } from '@zlden/react-developer-burger-ui-components';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';
import { Preloader } from '@ui';
import styles from './feed.module.css';

export const Feed: FC = () => {
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [totalToday, setTotalToday] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Функция загрузки данных с сервера
  const loadFeeds = async () => {
    setIsLoading(true);
    try {
      const data = await getFeedsApi();
      setOrders(data.orders);
      setTotal(data.total);
      setTotalToday(data.totalToday);
    } catch (error) {
      console.error('Ошибка загрузки ленты заказов:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Загружаем данные при монтировании
  useEffect(() => {
    loadFeeds();
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <main className={styles.containerMain}>
      <div className={styles.titleBox}>
        <h1 className={`text text_type_main-large ${styles.title}`}>
          Лента заказов
        </h1>
        <RefreshButton text='Обновить' onClick={loadFeeds} extraClass='ml-30' />
      </div>
      <div className={styles.main}>
        <div className={styles.columnOrders}>
          <OrdersList orders={orders} />
        </div>
        <div className={styles.columnInfo}>
          <FeedInfo />
        </div>
      </div>
    </main>
  );
};
