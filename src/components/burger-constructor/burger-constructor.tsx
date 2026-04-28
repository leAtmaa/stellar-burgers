import { FC, useMemo } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} from '../../services/slices/constructorSlice';
import { createOrder, closeOrderModal } from '../../services/slices/orderSlice';
import { useNavigate } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Получаем данные из store
  const { bun, ingredients } = useSelector((state) => state.burgerConstructor);
  const { user } = useSelector((state) => state.user);
  const { orderRequest, orderModalData } = useSelector((state) => state.order);

  // Обработчик оформления заказа
  const onOrderClick = async () => {
    if (!bun || orderRequest) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const orderData = [bun._id, ...ingredients.map((item) => item._id)];

    try {
      await dispatch(createOrder(orderData)).unwrap();
      dispatch(clearConstructor());
    } catch (err) {
      console.error('Ошибка оформления заказа:', err);
    }
  };

  const handleCloseOrderModal = () => {
    dispatch(closeOrderModal());
  };

  const handleRemoveIngredient = (id: string) => {
    dispatch(removeIngredient(id));
  };

  const handleMoveUp = (index: number) => {
    dispatch(moveIngredientUp(index));
  };

  const handleMoveDown = (index: number) => {
    dispatch(moveIngredientDown(index));
  };

  const price = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (sum, item) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  const constructorItems = {
    bun,
    ingredients
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={handleCloseOrderModal}
      removeIngredient={handleRemoveIngredient}
      moveIngredientUp={handleMoveUp}
      moveIngredientDown={handleMoveDown}
    />
  );
};
