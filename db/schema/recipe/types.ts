import { InferModel } from 'drizzle-orm';
import { recipes } from './recipes';
import { recipeImages } from './recipe-images';
import { recipeTypes } from './recipe-types';

export type Recipe = InferModel<typeof recipes>;
export type RecipeImage = InferModel<typeof recipeImages>;
export type RecipeType = InferModel<typeof recipeTypes>;
