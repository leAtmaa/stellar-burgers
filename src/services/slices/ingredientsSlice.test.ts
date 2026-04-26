import {
  fetchIngredients,
  ingredientsReducer
} from './ingredientsSlice';
import { TIngredient } from '@utils-types';

// Моковые данные для тестов
const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-03.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png'
  }
];

describe('ingredients слайс', () => {
  const initialState = {
    data: [],
    loading: false,
    error: null
  };

  describe('Начальное состояние', () => {
    it('должно иметь правильное начальное состояние', () => {
      const state = ingredientsReducer(undefined, { type: 'unknown' });
      
      expect(state).toEqual({
        data: [],
        loading: false,
        error: null
      });
    });
  });

  describe('Асинхронный запрос fetchIngredients', () => {
    describe('Обработка экшена pending', () => {
      it('должен устанавливать loading в true и сбрасывать error при начале запроса', () => {
        const action = { type: fetchIngredients.pending.type };
        const newState = ingredientsReducer(initialState, action);

        expect(newState.loading).toBe(true);
        expect(newState.error).toBe(null);
        expect(newState.data).toEqual([]);
      });

      it('должен сбрасывать предыдущую ошибку при новом запросе', () => {
        const errorState = {
          data: [],
          loading: false,
          error: 'Предыдущая ошибка'
        };
        
        const action = { type: fetchIngredients.pending.type };
        const newState = ingredientsReducer(errorState, action);

        expect(newState.loading).toBe(true);
        expect(newState.error).toBe(null);
      });
    });

    describe('Обработка экшена fulfilled', () => {
      it('должен устанавливать loading в false и сохранять полученные данные при успешном запросе', () => {
        const action = {
          type: fetchIngredients.fulfilled.type,
          payload: mockIngredients
        };
        const newState = ingredientsReducer(initialState, action);

        expect(newState.loading).toBe(false);
        expect(newState.error).toBe(null);
        expect(newState.data).toEqual(mockIngredients);
        expect(newState.data).toHaveLength(2);
      });

      it('должен заменять старые данные новыми при успешном запросе', () => {
        const oldState = {
          data: [{ ...mockIngredients[0], name: 'Старая булка' }],
          loading: false,
          error: null
        };
        
        const action = {
          type: fetchIngredients.fulfilled.type,
          payload: mockIngredients
        };
        const newState = ingredientsReducer(oldState, action);

        expect(newState.data).toEqual(mockIngredients);
        expect(newState.data[0].name).toBe('Краторная булка N-200i');
      });
    });

    describe('Обработка экшена rejected', () => {
      it('должен устанавливать loading в false и сохранять ошибку при неудачном запросе', () => {
        const errorMessage = 'Ошибка загрузки ингредиентов';
        const action = {
          type: fetchIngredients.rejected.type,
          error: { message: errorMessage }
        };
        const newState = ingredientsReducer(initialState, action);

        expect(newState.loading).toBe(false);
        expect(newState.error).toBe(errorMessage);
        expect(newState.data).toEqual([]);
      });
    });
  });
});
