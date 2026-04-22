import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch } from '../../services/store';
import { registerUser } from '../../services/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { RegisterUI } from '@ui-pages';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError(undefined);
    try {
      await dispatch(
        registerUser({ name: userName, email, password })
      ).unwrap();
      navigate('/');
    } catch (err) {
      setError('Ошибка регистрации. Попробуйте другой email.');
    }
  };

  return (
    <RegisterUI
      errorText={error}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
