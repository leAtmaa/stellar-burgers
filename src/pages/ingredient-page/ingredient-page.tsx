import { FC } from 'react';
import { IngredientDetails } from '../../components';
import styles from './ingredient-page.module.css';

export const IngredientPage: FC = () => (
  <div className={styles.container}>
    <IngredientDetails />
  </div>
);
