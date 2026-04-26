import constructorSlice, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor,
  constructorReducer
} from './constructorSlice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

// Моковые данные для тестов
const mockBun: TIngredient = {
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
};

const mockIngredient1: TIngredient = {
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
};

const mockIngredient2: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png'
};

describe('burgerConstructor слайс', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  describe('Начальное состояние', () => {
    it('должно иметь правильное начальное состояние', () => {
      const state = constructorReducer(undefined, { type: 'unknown' });
      
      expect(state).toEqual({
        bun: null,
        ingredients: []
      });
    });
  });

  describe('Редьюсер addIngredient', () => {
    describe('Добавление булки', () => {
      it('должен добавлять булку в конструктор', () => {
        const action = addIngredient(mockBun);
        const newState = constructorReducer(initialState, action);

        expect(newState.bun).not.toBeNull();
        expect(newState.bun?.name).toBe('Краторная булка N-200i');
        expect(newState.bun?.type).toBe('bun');
        expect(newState.bun?.price).toBe(1255);
        expect(newState.bun).toHaveProperty('id');
      });

      it('должен заменять булку при добавлении другой булки', () => {
        const firstAction = addIngredient(mockBun);
        const afterFirst = constructorReducer(initialState, firstAction);
        
        const mockBun2: TIngredient = {
          ...mockBun,
          _id: '643d69a5c3f7b9001cfa093d',
          name: 'Флюоресцентная булка R2-D3',
          price: 988
        };
        
        const secondAction = addIngredient(mockBun2);
        const afterSecond = constructorReducer(afterFirst, secondAction);

        expect(afterSecond.bun?.name).toBe('Флюоресцентная булка R2-D3');
        expect(afterSecond.bun?.price).toBe(988);
      });
    });

    describe('Добавление начинки', () => {
      it('должен добавлять начинку (ингредиент) в конструктор', () => {
        const action = addIngredient(mockIngredient1);
        const newState = constructorReducer(initialState, action);

        expect(newState.ingredients).toHaveLength(1);
        expect(newState.ingredients[0].name).toBe('Биокотлета из марсианской Магнолии');
        expect(newState.ingredients[0].type).toBe('main');
        expect(newState.ingredients[0]).toHaveProperty('id');
      });

      it('должен добавлять несколько начинок в конструктор', () => {
        let state = constructorReducer(initialState, addIngredient(mockIngredient1));
        state = constructorReducer(state, addIngredient(mockIngredient2));

        expect(state.ingredients).toHaveLength(2);
        expect(state.ingredients[0].name).toBe('Биокотлета из марсианской Магнолии');
        expect(state.ingredients[1].name).toBe('Соус Spicy-X');
      });

      it('должен добавлять уникальный id каждому ингредиенту', () => {
        const action1 = addIngredient(mockIngredient1);
        const state1 = constructorReducer(initialState, action1);
        
        const action2 = addIngredient(mockIngredient1);
        const state2 = constructorReducer(state1, action2);

        expect(state2.ingredients[0].id).not.toBe(state2.ingredients[1].id);
      });
    });
  });

  describe('Редьюсер removeIngredient', () => {
    describe('Удаление существующего ингредиента', () => {
      it('должен удалять ингредиент из конструктора по id', () => {
        const addAction = addIngredient(mockIngredient1);
        const stateWithIngredient = constructorReducer(initialState, addAction);
        const ingredientId = stateWithIngredient.ingredients[0].id;
        
        const removeAction = removeIngredient(ingredientId);
        const newState = constructorReducer(stateWithIngredient, removeAction);

        expect(newState.ingredients).toHaveLength(0);
      });

      it('должен удалять только указанный ингредиент, оставляя остальные', () => {
        let state = constructorReducer(initialState, addIngredient(mockIngredient1));
        state = constructorReducer(state, addIngredient(mockIngredient2));
        
        const firstIngredientId = state.ingredients[0].id;
        
        const removeAction = removeIngredient(firstIngredientId);
        const newState = constructorReducer(state, removeAction);

        expect(newState.ingredients).toHaveLength(1);
        expect(newState.ingredients[0].name).toBe('Соус Spicy-X');
      });
    });

    describe('Удаление несуществующего ингредиента', () => {
      it('не должен ничего менять при удалении по несуществующему id', () => {
        const state = constructorReducer(initialState, addIngredient(mockIngredient1));
        
        const removeAction = removeIngredient('non-existent-id');
        const newState = constructorReducer(state, removeAction);

        expect(newState.ingredients).toHaveLength(1);
        expect(newState.ingredients[0].name).toBe('Биокотлета из марсианской Магнолии');
      });
    });
  });

  describe('Редьюсер moveIngredientUp', () => {
    describe('Перемещение ингредиента', () => {
      it('должен перемещать ингредиент вверх по списку', () => {
        let state = constructorReducer(initialState, addIngredient(mockIngredient1));
        state = constructorReducer(state, addIngredient(mockIngredient2));
        
        const moveAction = moveIngredientUp(1);
        const newState = constructorReducer(state, moveAction);

        expect(newState.ingredients[0].name).toBe('Соус Spicy-X');
        expect(newState.ingredients[1].name).toBe('Биокотлета из марсианской Магнолии');
      });
    });

    describe('Граничные случаи', () => {
      it('не должен перемещать ингредиент вверх, если он уже на первом месте', () => {
        let state = constructorReducer(initialState, addIngredient(mockIngredient1));
        state = constructorReducer(state, addIngredient(mockIngredient2));
        
        const moveAction = moveIngredientUp(0);
        const newState = constructorReducer(state, moveAction);

        expect(newState.ingredients[0].name).toBe('Биокотлета из марсианской Магнолии');
        expect(newState.ingredients[1].name).toBe('Соус Spicy-X');
      });
    });
  });

  describe('Редьюсер moveIngredientDown', () => {
    describe('Перемещение ингредиента', () => {
      it('должен перемещать ингредиент вниз по списку', () => {
        let state = constructorReducer(initialState, addIngredient(mockIngredient1));
        state = constructorReducer(state, addIngredient(mockIngredient2));
        
        const moveAction = moveIngredientDown(0);
        const newState = constructorReducer(state, moveAction);

        expect(newState.ingredients[0].name).toBe('Соус Spicy-X');
        expect(newState.ingredients[1].name).toBe('Биокотлета из марсианской Магнолии');
      });
    });

    describe('Граничные случаи', () => {
      it('не должен перемещать ингредиент вниз, если он уже на последнем месте', () => {
        let state = constructorReducer(initialState, addIngredient(mockIngredient1));
        state = constructorReducer(state, addIngredient(mockIngredient2));
        
        const moveAction = moveIngredientDown(1);
        const newState = constructorReducer(state, moveAction);

        expect(newState.ingredients[0].name).toBe('Биокотлета из марсианской Магнолии');
        expect(newState.ingredients[1].name).toBe('Соус Spicy-X');
      });
    });
  });

  describe('Редьюсер clearConstructor', () => {
    describe('Очистка конструктора', () => {
      it('должен очищать конструктор (булку и ингредиенты)', () => {
        let state = constructorReducer(initialState, addIngredient(mockBun));
        state = constructorReducer(state, addIngredient(mockIngredient1));
        state = constructorReducer(state, addIngredient(mockIngredient2));
        
        expect(state.bun).not.toBeNull();
        expect(state.ingredients).toHaveLength(2);
        
        const clearAction = clearConstructor();
        const newState = constructorReducer(state, clearAction);

        expect(newState.bun).toBeNull();
        expect(newState.ingredients).toHaveLength(0);
      });

      it('должен очищать конструктор даже если он пуст', () => {
        const clearAction = clearConstructor();
        const newState = constructorReducer(initialState, clearAction);

        expect(newState.bun).toBeNull();
        expect(newState.ingredients).toHaveLength(0);
      });
    });
  });
});
