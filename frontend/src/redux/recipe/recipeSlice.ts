import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import "../../axios/axios";
import {
  Ingredient,
  RecipeContents,
  RecipeIngredient,
} from "../../interfaces/recipe.ingerface";
import store, { RootState } from "../store";

interface InitialState {
  isLoading: boolean;
  ingredients: Ingredient[];
  suggestedIngredients: Ingredient[];
  newIngredient: string;
  recipeIngredients: RecipeIngredient[];
  recipeContents: RecipeContents;
  uploadedImages: string[];
  userRecipe: RecipeContents[];
  isDeleted: boolean;
}

const initialState: InitialState = {
  isLoading: false,
  ingredients: [], //ingredients fetched from DB
  suggestedIngredients: [],
  newIngredient: "",
  recipeIngredients: [], //ingredients added for this recipe
  recipeContents: {
    title: "",
    duration: "",
    shortDescription: "",
    images: [],
    introduction: "",
    steps: [],
  },
  uploadedImages: [],
  userRecipe: [], //all recipe added by the user
  isDeleted: false,
};

export const getIngredients = createAsyncThunk(
  "recipe/getIngredients",
  async () => {
    try {
      const res = await axios.get("/ingredient/");
      return res.data.data;
    } catch (error: any) {
      console.log(error);
    }
  }
);

export const createIngredient = createAsyncThunk(
  "recipe/createIngredient",
  async (newIngredient: string, { rejectWithValue }) => {
    try {
      const res = await axios.post("/ingredient/add", {
        ingredientName: newIngredient,
      });
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const getOneRecipe = createAsyncThunk(
  "recipe/getOneRecipe",
  async (recipeId: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/recipe/${recipeId}`);
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const getUserRecipe = createAsyncThunk(
  "recipe/getUserRecipe",
  async () => {
    try {
      const res = await axios.get("/recipe/");
      return res.data.data;
    } catch (error: any) {
      console.log(error);
    }
  }
);

export const deleteRecipe = createAsyncThunk(
  "recipe/deleteRecipe",
  async (recipeId: any) => {
    try {
      await axios.delete(`/recipe/${recipeId}`);
    } catch (error: any) {
      console.log(error);
    }
  }
);

const recipeSlice = createSlice({
  name: "recipe",
  initialState,
  reducers: {
    handleIngredientSuggestion: (state, action) => {
      if (action.payload) {
        state.suggestedIngredients = state.ingredients.filter((el) => {
          return el.ingredientName
            .toLowerCase()
            .includes(action.payload.toLowerCase());
        });
      } else {
        state.suggestedIngredients = [];
      }

      if (state.suggestedIngredients.length == 0)
        state.newIngredient = action.payload;
    },

    addRecipeIngredient: (state, action) => {
      state.recipeIngredients = [...state.recipeIngredients, action.payload];
      state.suggestedIngredients = [];
      console.log(state.recipeIngredients);
    },

    removeRecipeIngredient: (state, action) => {
      state.recipeIngredients = state.recipeIngredients.filter(
        (el) => el.ingredientName !== action.payload
      );
    },

    handleRecipeContent: (state, action) => {
      const { name, value, files, steps } = action.payload;
      if (steps) {
        state.recipeContents = {
          ...state.recipeContents,
          steps: [...state.recipeContents.steps, steps],
        };
        return;
      }
      state.recipeContents = {
        ...state.recipeContents,
        [name]: name === "images" ? files : value,
      };
    },

    removeImage: (state, action) => {
      if (state.recipeContents.images.length > 0)
        state.recipeContents.images = Array.from(
          state.recipeContents.images
        ).filter((file, ind) => {
          return ind !== action.payload;
        });
    },

    removeSteps: (state, action) => {
      console.log(action.payload);
      state.recipeContents.steps = state.recipeContents.steps.filter(
        (el) => el !== action.payload
      );
    },

    resetForm: (state) => {
      state.recipeContents = {
        ...initialState.recipeContents,
      };
      state.uploadedImages = [];
      state.recipeIngredients = [...initialState.recipeIngredients];
    },
    handleUploadedImage: (state, action) => {
      state.uploadedImages = state.uploadedImages.filter(
        (el, ind) => ind !== action.payload
      );
    },
    toggleIsDeleted: (state) => {
      state.isDeleted = !state.isDeleted;
    },
    removeSuggestedIngredient: (state) => {
      state.suggestedIngredients = [];
    },
    removeNewIngredient: (state) => {
      state.newIngredient = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(createIngredient.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(createIngredient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.newIngredient = "";
      })
      .addCase(createIngredient.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(getOneRecipe.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getOneRecipe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recipeContents = {
          title: action.payload.title,
          duration: action.payload.duration,
          images: [],
          shortDescription: action.payload.shortDescription,
          introduction: action.payload.introduction,
          steps: action.payload.steps,
        };

        state.recipeIngredients = action.payload.ingredients;

        state.uploadedImages = action.payload.images;
      })
      .addCase(getOneRecipe.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(getUserRecipe.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getUserRecipe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userRecipe = action.payload;
      })
      .addCase(getUserRecipe.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export const selectRecipe = (state: RootState) => state.recipe;

export const {
  handleIngredientSuggestion,
  addRecipeIngredient,
  removeRecipeIngredient,
  handleRecipeContent,
  removeImage,
  removeSteps,
  resetForm,
  handleUploadedImage,
  toggleIsDeleted,
  removeSuggestedIngredient,
  removeNewIngredient,
} = recipeSlice.actions;

export default recipeSlice.reducer;
