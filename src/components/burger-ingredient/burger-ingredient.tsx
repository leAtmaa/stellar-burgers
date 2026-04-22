import { FC, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { setIngredient } from '../../services/slices/ingredientDetailsSlice';
import { addIngredient } from '../../services/slices/constructorSlice';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleAdd = () => {
      dispatch(addIngredient(ingredient));
    };

    const handleClick = () => {
      dispatch(setIngredient(ingredient));
      navigate(`/ingredients/${ingredient._id}`, {
        state: { background: location }
      });
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
        handleClick={handleClick}
      />
    );
  }
);
