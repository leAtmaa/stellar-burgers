import { TIngredient } from '@utils-types';
import { Location } from 'react-router-dom';

export type TBurgerIngredientUIProps = {
  ingredient: TIngredient;
  count?: number;
  handleAdd: () => void;
  handleClick: () => void;
  locationState: { background: Location };
};
