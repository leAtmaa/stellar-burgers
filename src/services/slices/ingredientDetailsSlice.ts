import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

type TIngredientDetailsState = {
  ingredient: TIngredient | null;
};

const initialState: TIngredientDetailsState = {
  ingredient: null
};

const ingredientDetailsSlice = createSlice({
  name: 'ingredientDetails',
  initialState,
  reducers: {
    setIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.ingredient = action.payload;
    },
    clearIngredient: (state) => {
      state.ingredient = null;
    }
  }
});

export const { setIngredient, clearIngredient } =
  ingredientDetailsSlice.actions;
export const ingredientDetailsReducer = ingredientDetailsSlice.reducer;
