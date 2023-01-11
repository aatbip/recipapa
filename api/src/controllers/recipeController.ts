import { Request, Response } from "express";
import { IGetAuthorizationHeaderRequest } from "../interfaces/auth.interface";
import { Recipe } from "../models/Recipe";
import { asyncWrapper } from "../utils/asyncWrapper";
import { success } from "../utils/responseMessage";
import { unlink } from "fs/promises";
import path from "path";
import { Payload } from "../interfaces/payload.interface";

const createRecipe = asyncWrapper(
  async (req: IGetAuthorizationHeaderRequest, res: Response) => {
    const {
      title,
      duration,
      shortDescription,
      introduction,
      ingredients,
      steps,
    } = req.body;

    const userId = req.user.userId;

    let images: string[] = [];

    if ((req as any).files) {
      (req as any).files.map((image: any) => {
        images = [...images, image.filename];
      });
    }

    const newRecipe = await Recipe.create({
      title: title,
      duration: duration,
      shortDescription: shortDescription,
      images: images,
      introduction: introduction,
      ingredients: JSON.parse(ingredients),
      userId: userId,
      steps: JSON.parse(steps),
    });

    res.status(200).json(success(newRecipe));
  }
);

const getOneRecipe = asyncWrapper(async (req: Request, res: Response) => {
  const { recipeId } = req.params;

  const recipe = await Recipe.findById(recipeId).populate("userId", "username");

  res.status(200).json(success(recipe));
});

const getUserRecipe = asyncWrapper(
  async (req: IGetAuthorizationHeaderRequest, res: Response) => {
    const { userId } = req.user;

    console.log(userId); 

    const recipe = await Recipe.find({ userId: userId }).populate(
      "userId",
      "username"
    );

    res.status(200).json(success(recipe));
  }
);

const getAllRecipe = asyncWrapper(async (req: Request, res: Response) => {
  const recipe = await Recipe.find().populate("userId", "username");

  res.status(200).json(success(recipe));
});

const updateRecipe = asyncWrapper(async (req: Request, res: Response) => {
  const { recipeId } = req.params;

  const {
    title,
    duration,
    shortDescription,
    introduction,
    ingredients,
    steps,
    uploadedImages,
  } = req.body;

  let images: string[] = [];

  if ((req as any).files) {
    (req as any).files.map((image: any) => {
      images = [...images, image.filename];
    });
  }

  const _recipe = await Recipe.findById(recipeId);

  let _uploadedImages = JSON.parse(uploadedImages);

  // let imagesToDelete: string[] = [];
  // let imagesToKeep: string[] = [];

  // _recipe?.images.map((el) => {
  //   _uploadedImages.map((elm: string) => {
  //     if (elm == el) {
  //       imagesToKeep.push(el);
  //     }
  //     if (_uploadedImages.length !== _recipe?.images.length)
  //       if (elm !== el) {
  //         imagesToDelete.push(el);
  //       }
  //   });
  // });

  // if (_uploadedImages.length == 0) {
  //   _recipe?.images.map((el) => {
  //     imagesToDelete.push(el);
  //   });
  // }

  let imagesToKeep = _recipe?.images.filter((el) => {
    return _uploadedImages.includes(el);
  });

  let imagesToDelete = _recipe?.images.filter((el) => {
    return !_uploadedImages.includes(el);
  });

  if (imagesToDelete) {
    imagesToDelete?.map(async (img) => {
      await unlink(`${path.resolve(__dirname)}/../public/recipe/${img}`);
    });
  }

  if (imagesToKeep) images = [...images, ...imagesToKeep];

  let updatedRecipe = await Recipe.findByIdAndUpdate(
    recipeId,
    {
      title: title,
      duration: duration,
      shortDescription: shortDescription,
      images: images,
      introduction: introduction,
      ingredients: JSON.parse(ingredients),
      steps: JSON.parse(steps),
    },
    { new: true }
  );

  res.status(200).json(success(updatedRecipe));
});

const removeRecipe = asyncWrapper(async (req: Request, res: Response) => {
  const { recipeId } = req.params;

  const recipe = await Recipe.findByIdAndDelete(recipeId);

  recipe?.images.map(async (img) => {
    await unlink(`${path.resolve(__dirname)}/../public/recipe/${img}`);
  });

  res.status(200).json(success("Deleted!"));
});

const searchRecipe = asyncWrapper(async (req: Request, res: Response) => {
  let { keyword, ingredients } = req.query as unknown as Payload;

  let recipe: any = [];

  if (keyword) {
    let query: any = {};
    query.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { shortDescription: { $regex: keyword, $options: "i" } },
    ];

    let keywordMatch = await Recipe.find(query);
    if (keywordMatch.length > 0) recipe = [...recipe, ...keywordMatch];
  }

  if (ingredients) {
    let query: any = {};

    let ing = ingredients.split(",");
    query = {
      ...query,
      ingredients: {
        $elemMatch: {
          ingredientName: { $in: ing },
        },
      },
    };
    let ingredientMatch = await Recipe.find(query);
    if (ingredientMatch.length > 0) recipe = [...recipe, ...ingredientMatch];
  }

  recipe = recipe.reduce((unique: any, o: any) => {
    if (!unique.some((obj: any) => obj.id === o.id)) {
      unique.push(o);
    }
    return unique;
  }, []);

  res.status(200).json(success(recipe));
});

export {
  createRecipe,
  getOneRecipe,
  updateRecipe,
  getUserRecipe,
  removeRecipe,
  getAllRecipe,
  searchRecipe,
};
