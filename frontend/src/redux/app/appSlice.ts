import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Qs from "qs";
import { Ingredient, RecipeContents } from "../../interfaces/recipe.ingerface";
import { RootState } from "../store";

interface InitialState {
  isLoading: boolean;
  recipe: RecipeContents[];
  searchKeyword: "";
  ingredients: Ingredient[];
  typedIngredient: string;
  filteredIngredients: Ingredient[];
  selectedIngredients: string[];
  queryFilteredRecipe: RecipeContents[];
  recipeDetail: RecipeContents;
}

const initialState: InitialState = {
  isLoading: false,
  recipe: [],
  searchKeyword: "", //keyword to search
  ingredients: [],
  typedIngredient: "",
  filteredIngredients: [],
  selectedIngredients: [], //ingredients to filter
  queryFilteredRecipe: [], //recipe after filter
  recipeDetail: {
    _id: "",
    title: "",
    duration: "",
    ingredients: [],
    shortDescription: "",
    images: [],
    introduction: "",
    steps: [],
    userId: "",
  },
};

export const getAllRecipe = createAsyncThunk("app/getAllRecipe", async () => {
  try {
    const res = await axios.get("/recipe/all/");
    return res.data.data;
  } catch (error: any) {
    console.log(error);
  }
});

export const getIngredients = createAsyncThunk(
  "app/getIngredients",
  async () => {
    try {
      const res = await axios.get("/ingredient/");
      return res.data.data;
    } catch (error: any) {
      console.log(error);
    }
  }
);

export const searchRecipe = createAsyncThunk(
  "app/searchRecipe",
  async (query: any, { rejectWithValue }) => {
    const { searchKeyword, selectedIngredients } = query;

    try {
      const res = await axios.get(`/recipe/search`, {
        params: new URLSearchParams({
          keyword: searchKeyword,
          ingredients: selectedIngredients,
        }),
      });
      console.log(res);
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const getOneRecipe = createAsyncThunk(
  "app/getOneRecipe",
  async (recipeId: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/recipe/${recipeId}`);
      console.log(res.data)
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    handleSearchKeyword: (state, action) => {
      state.searchKeyword = action.payload;
    },
    handleTypedIngredient: (state, action) => {
      state.typedIngredient = action.payload;

      state.filteredIngredients = state.ingredients.filter((el) =>
        el.ingredientName.toLowerCase().includes(action.payload.toLowerCase())
      );
    },

    setSelectedIngredients: (state, action) => {
      state.selectedIngredients = [
        ...state.selectedIngredients,
        action.payload,
      ];
      state.typedIngredient = "";
    },

    removeFilter: (state) => {
      state.selectedIngredients = [];
      state.typedIngredient = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllRecipe.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getAllRecipe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recipe = action.payload;
      })
      .addCase(getAllRecipe.rejected, (state, action) => {
        state.isLoading = false;
      })

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

      .addCase(searchRecipe.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(searchRecipe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.queryFilteredRecipe = action.payload;
      })
      .addCase(searchRecipe.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(getOneRecipe.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getOneRecipe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recipeDetail = {
          title: action.payload.title,
          duration: action.payload.duration,
          ingredients: action.payload.ingredients, 
          images: action.payload.images,
          shortDescription: action.payload.shortDescription,
          introduction: action.payload.introduction,
          steps: action.payload.steps,
          userId: action.payload.userId.username
        };
      })
      .addCase(getOneRecipe.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export const selectApp = (state: RootState) => state.app;

export const {
  handleSearchKeyword,
  handleTypedIngredient,
  setSelectedIngredients,
  removeFilter,
} = appSlice.actions;

export default appSlice.reducer;
