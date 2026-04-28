import { combineReducers } from '@reduxjs/toolkit';
import store, { rootReducer } from './store';

describe('rootReducer', () => {
  describe('Инициализация rootReducer', () => {
    it('должен возвращать корректное начальное состояние при вызове с undefined и unknown action', () => {
      // Создаем комбинированный редьюсер из объекта
      const combinedReducer = combineReducers(rootReducer);
      
      // Вызываем с undefined и unknown action
      const state = combinedReducer(undefined, { type: 'UNKNOWN_ACTION' });
      
      // Получаем ожидаемое начальное состояние
      const expectedState = store.getState();
      
      expect(state).toEqual(expectedState);
    });

    it('должен содержать все необходимые слайсы', () => {
      expect(rootReducer).toHaveProperty('ingredients');
      expect(rootReducer).toHaveProperty('ingredientDetails');
      expect(rootReducer).toHaveProperty('burgerConstructor');
      expect(rootReducer).toHaveProperty('user');
      expect(rootReducer).toHaveProperty('order');
      expect(rootReducer).toHaveProperty('userOrders');
      expect(rootReducer).toHaveProperty('feed');
    });

    it('должен содержать 7 редьюсеров', () => {
      expect(Object.keys(rootReducer).length).toBe(7);
    });
  });
});
