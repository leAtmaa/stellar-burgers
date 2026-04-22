import { forwardRef, useMemo } from 'react';
import { useSelector } from '../../services/store'; // Добавляем импорт useSelector
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  // Получаем данные конструктора из store
  const { bun, ingredients: constructorIngredients } = useSelector(
    (state) => state.burgerConstructor
  );

  // Количество
  const ingredientsCounters = useMemo(() => {
    const counters: { [key: string]: number } = {};

    // Считаем начинки и соусы
    constructorIngredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });

    // Считаем булки
    if (bun) {
      counters[bun._id] = 2;
    }

    return counters;
  }, [bun, constructorIngredients]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
