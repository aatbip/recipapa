import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import RecipeCard from "../../components/recipeCard/RecipeCard";
import Spinner from "../../components/spinner/Spinner";
import {
  getUserRecipe,
  selectRecipe,
  toggleIsDeleted,
} from "../../redux/recipe/recipeSlice";
import store from "../../redux/store";
import styles from "./css/MyRecipe.module.css";

const MyRecipe = () => {
  const navigate = useNavigate();
  const { isLoading, userRecipe, isDeleted } = useSelector(selectRecipe);
  React.useEffect(() => {
    store.dispatch(getUserRecipe());
  }, [isDeleted]);

  

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <hr />
        <div className={styles.header}>
          <h1>My Recipes</h1>
          <button
            onClick={() => navigate("/app/create-recipe/add")}
            className="button-main"
            type="button"
          >
            Create Recipe
            <span>+</span>
          </button>
        </div>
        <div className={styles.recipe_cards_container}>
          {isLoading ? (
            <Spinner isLoading={isLoading} positionAbsolute={false} />
          ) : (
            userRecipe?.map((recipe) => {
              return (
                <RecipeCard
                  key={recipe._id}
                  isMyRecipe={true}
                  recipe={recipe}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRecipe;
