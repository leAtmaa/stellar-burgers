import { TConstructorIngredient, TOrder } from '@utils-types';

export type BurgerConstructorUIProps = {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  price: number;
  orderModalData: TOrder | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
  // Эти пропсы не используются в UI, но передаются для дочерних компонентов
  removeIngredient?: (id: string) => void;
  moveIngredientUp?: (index: number) => void;
  moveIngredientDown?: (index: number) => void;
};
