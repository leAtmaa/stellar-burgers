import { FC, useMemo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/userOrdersSlice';
import { getOrderByNumberApi } from '@api';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();
  // Получаем ингредиенты из store
  const { data: ingredients } = useSelector((state) => state.ingredients);
  const { orders } = useSelector((state) => state.userOrders);
  const [orderData, setOrderData] = useState<TOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем заказы пользователя если их нет
  useEffect(() => {
    if (orders.length === 0) {
      dispatch(fetchUserOrders());
    }
  }, [dispatch, orders.length]);

  // Загружаем данные заказа
  useEffect(() => {
    const loadOrder = async () => {
      setIsLoading(true);
      // Сначала пробуем найти заказ в истории пользователя
      const existingOrder = orders.find(
        (order) => order.number === Number(number)
      );
      if (existingOrder) {
        setOrderData(existingOrder);
        setIsLoading(false);
        return;
      }

      try {
        const response = await getOrderByNumberApi(Number(number));
        if (response.orders && response.orders.length > 0) {
          setOrderData(response.orders[0]);
        }
      } catch (error) {
        console.error('Ошибка загрузки заказа:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (number) {
      loadOrder();
    }
  }, [number, orders]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredients.find(
            (ing: TIngredient) => ing._id === item
          );
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {} as TIngredientsWithCount
    );

    // Общ стоимость
    const total = Object.values(ingredientsInfo).reduce(
      (acc: number, item: TIngredient & { count: number }) =>
        acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
