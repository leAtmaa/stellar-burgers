import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch } from '../../services/store';
import { loginUser } from '../../services/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { LoginUI } from '@ui-pages';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError(undefined);
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      navigate('/');
    } catch (err) {
      setError('Ошибка авторизации. Проверьте email и пароль.');
    }
  };

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
