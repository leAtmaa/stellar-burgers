import { FC } from 'react';
import { useSelector } from '../../services/store';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  // Получаем данные пользователя из store
  const { user } = useSelector((state) => state.user);

  return <AppHeaderUI userName={user?.name || ''} />;
};
