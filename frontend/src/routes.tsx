import { Link, useRoutes } from "react-router-dom";
import Authorize from "./components/authorization/Authorize";
import Layout from "./layout/Layout";
import CoverPage from "./pages/coverpage";
import CreateRecipe from "./pages/create-recipe";
import HomePage from "./pages/homepage";
import MyRecipe from "./pages/myrecipe";
import RecipeDetails from "./pages/recipe-details";
import SearchPage from "./pages/searchPage";

export default function Router() {
  return useRoutes([
    {
      path: "/",
      element: <CoverPage />,
    },
    {
      path: "/signup",
      element: <CoverPage />,
    },

    {
      path: "app/",
      element: (
        <Authorize>
          <Layout />
        </Authorize>
      ),

      children: [
        {
          path: "",
          element: <HomePage />,
        },
        {
          path: "search",
          element: <SearchPage />,
        },
        {
          path: "recipe/:recipeId/:recipeName",
          element: <RecipeDetails />,
        },
        {
          path: "myrecipe/:userId",
          element: <MyRecipe />,
        },
        {
          path: "create-recipe/add",
          element: <CreateRecipe />,
        },
        {
          path: "create-recipe/edit/:recipeId",
          element: <CreateRecipe />,
        },
      ],
    },

    // { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
