import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

// Тип состояния заказов пользователя
type TUserOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

// Начальное состояние
const initialState: TUserOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

// Асинхронный thunk для получения заказов пользователя
export const fetchUserOrders = createAsyncThunk(
  'userOrders/fetch',
  async () => {
    const orders = await getOrdersApi();
    return orders;
  }
);

// Создаем слайс
const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {
    clearUserOrders: (state) => {
      state.orders = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки заказов';
      });
  }
});

export const { clearUserOrders } = userOrdersSlice.actions;
export const userOrdersReducer = userOrdersSlice.reducer;
