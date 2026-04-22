import { Navigate, useLocation } from 'react-router-dom';
import { FC, ReactElement } from 'react';
import { useSelector } from '../../services/store';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean; // true - только для неавторизованных
  children: ReactElement;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const location = useLocation();
  const { user, isAuthChecked } = useSelector((state) => state.user);

  if (!isAuthChecked) {
    return null;
  }

  // Если роут только для неавторизованных, а пользователь авторизован
  if (onlyUnAuth && user) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  // Если роут для авторизованных, а пользователь не авторизован
  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return children;
};
