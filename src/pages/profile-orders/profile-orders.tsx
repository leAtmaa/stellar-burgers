import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/userOrdersSlice';
import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';
import { FC } from 'react';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.userOrders);

  // Загружаем заказы пользователя при монтировании компонента
  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
