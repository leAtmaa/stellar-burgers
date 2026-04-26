import { rootReducer } from './store';

describe('rootReducer', () => {
  describe('Инициализация rootReducer', () => {
    it('должен возвращать корректное начальное состояние при вызове с undefined и unknown action', () => {
      const initialState = {
        ingredients: {
          data: [],
          loading: false,
          error: null
        },
        ingredientDetails: {
          ingredient: null
        },
        burgerConstructor: {
          bun: null,
          ingredients: []
        },
        user: {
          user: null,
          isAuthChecked: false,
          isLoading: false,
          error: null
        },
        order: {
          orderRequest: false,
          orderModalData: null,
          error: null
        },
        userOrders: {
          orders: [],
          isLoading: false,
          error: null
        },
        feed: {
          orders: [],
          total: 0,
          totalToday: 0,
          isLoading: false,
          error: null
        }
      };

      const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
      
      expect(state).toEqual(initialState);
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
