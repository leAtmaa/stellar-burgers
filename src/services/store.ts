import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { ingredientsReducer } from './slices/ingredientsSlice';
import { ingredientDetailsReducer } from './slices/ingredientDetailsSlice';
import { constructorReducer } from './slices/constructorSlice';
import { userReducer } from './slices/userSlice';
import { orderReducer } from './slices/orderSlice';
import { userOrdersReducer } from './slices/userOrdersSlice';
import { feedReducer } from './slices/feedSlice';

// Экспортируем rootReducer для тестов
export const rootReducer = {
  ingredients: ingredientsReducer,
  ingredientDetails: ingredientDetailsReducer,
  burgerConstructor: constructorReducer,
  user: userReducer,
  order: orderReducer,
  userOrders: userOrdersReducer,
  feed: feedReducer
};

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
