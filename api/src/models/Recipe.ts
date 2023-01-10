import mongoose, { Schema, model, Types, Mongoose } from "mongoose";

interface IRecipe {
  _id: Types.ObjectId;
  title: string;
  duration: string;
  shortDescription: string;
  images: string[];
  introduction: string;
  ingredients: [
    {
      ingredientName: string;
      quantity: string;
    }
  ];
  steps: string[];
  userId: Types.ObjectId;
}

const recipeSchema = new Schema<IRecipe>({
  title: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  images: [String],
  introduction: {
    type: String,
    required: true,
  },
  ingredients: [
    {
      ingredientName: {
        type: String,
        required: true,
      },
      quantity: {
        type: String,
        required: true,
      },
    },
  ],
  steps: [String],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Recipe = model<IRecipe>("Recipe", recipeSchema);

export { Recipe };
