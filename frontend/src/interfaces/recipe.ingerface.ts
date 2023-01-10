export type Ingredient = {
  _id: string;
  ingredientName: string;
};

export interface RecipeIngredient {
  ingredientName: string;
  quantity: string;
}

export interface RecipeContents {
  _id?: string; 
  title: string;
  duration: string;
  ingredients?: RecipeContents[]; 
  shortDescription: string;
  images: string[];
  introduction: string;
  steps: string[];
  userId?: any; 
}
