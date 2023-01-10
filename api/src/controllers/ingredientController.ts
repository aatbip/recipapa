import { Request, Response } from "express";
import { Ingredient } from "../models/Ingredient";
import { asyncWrapper } from "../utils/asyncWrapper";
import { success } from "../utils/responseMessage";

const createIngredient = asyncWrapper(async (req: Request, res: Response) => {
  const { ingredientName } = req.body;


  const newIngredient = await Ingredient.create({
    ingredientName,
  });

  res.status(200).json(success(newIngredient));
});

const getAllIngredients = asyncWrapper(async (req: Request, res: Response) => {
  const ingredients = await Ingredient.find();

  res.status(200).json(success(ingredients));
});

export { createIngredient, getAllIngredients };
