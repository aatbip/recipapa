import {
  Action,
  configureStore,
  ThunkAction,
} from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import recipeReducer from "./recipe/recipeSlice";
import appReducer from "./app/appSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    recipe: recipeReducer,
    app: appReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
