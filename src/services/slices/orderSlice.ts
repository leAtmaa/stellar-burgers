import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';

// Тип состояния заказа
type TOrderState = {
  orderRequest: boolean; // Флаг загрузки
  orderModalData: TOrder | null; // Данные заказа для модалки
  error: string | null;
};

// Начальное состояние
const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  error: null
};

// Асинхронный thunk для создания заказа
export const createOrder = createAsyncThunk(
  'order/create',
  async (data: string[]) => {
    const response = await orderBurgerApi(data);
    // Преобразуем ответ в формат TOrder
    const order: TOrder = {
      _id: response.order._id,
      status: response.order.status,
      name: response.order.name,
      createdAt: response.order.createdAt,
      updatedAt: response.order.updatedAt,
      number: response.order.number,
      ingredients: data // Используем отправленные ингредиенты
    };
    return order;
  }
);

// Создаем слайс
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // Закрытие модалки и очистка данных заказа
    closeOrderModal: (state) => {
      state.orderModalData = null;
      state.orderRequest = false;
      state.error = null;
    },
    // Сброс ошибки
    clearOrderError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Создание заказа
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
        state.orderModalData = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка создания заказа';
        state.orderModalData = null;
      });
  }
});

export const { closeOrderModal, clearOrderError } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
