import mongoose, { Schema, model, Types, Mongoose } from "mongoose";

interface IIngredient {
  _id: Types.ObjectId;
  ingredientName: string;
}

const ingredientSchema = new Schema<IIngredient>({
  ingredientName: {
    type: String,
    required: true,
  },
});

const Ingredient = model<IIngredient>("Ingredient", ingredientSchema);

export { Ingredient };
