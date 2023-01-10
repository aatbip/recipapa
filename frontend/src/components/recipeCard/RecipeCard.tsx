import React from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { RecipeContents } from "../../interfaces/recipe.ingerface";
import { deleteRecipe, getUserRecipe } from "../../redux/recipe/recipeSlice";
import store from "../../redux/store";
import styles from "./css/RecipeCard.module.css";

interface Prop {
  recipe: RecipeContents;
  isMyRecipe: boolean;
}

const RecipeCard: React.FC<Prop> = ({ recipe, isMyRecipe }) => {
  const navigate = useNavigate();

  return (
    <div
      className={styles.container}
      style={{
        cursor: !isMyRecipe ? "pointer" : "",
      }}
      onClick={() => !isMyRecipe && navigate(`/app/recipe/${recipe._id}/${recipe.title.replaceAll(" ", "-")}`)}
    >
      <div className={styles.wrapper}>
        <div className={styles.image_container}>
          <img
            src={`${process.env.REACT_APP_API_KEY}/recipe/${recipe.images[0]}`}
            alt={recipe.images[0]}
          />
        </div>
        <div className={styles.content_container}>
          <p className={styles.recipe_title}>{recipe.title}</p>
          <p>by {recipe?.userId?.username}</p>
          <section>
            <img src="/clock.svg" alt="clock" />
            <p className={styles.text_display}>{recipe.duration}</p>
          </section>
          <p className={styles.text_display}>{recipe.shortDescription}</p>
        </div>
        {isMyRecipe && (
          <div className={styles.card_buttons}>
            <div
              onClick={() => navigate(`/app/create-recipe/edit/${recipe._id}`)}
              style={{
                display: "flex",
                gap: "5px",
              }}
            >
              <p>Edit</p>
              <img
                style={{
                  width: "20px",
                  height: "20px",
                }}
                src="/edit-icon.svg"
                alt="clock"
              />
            </div>
            <div
              onClick={() => {
                store.dispatch(deleteRecipe(recipe._id));
                store.dispatch(getUserRecipe());
                toast.success("You deleted one recipe just now!");
              }}
              style={{
                display: "flex",
                gap: "5px",
              }}
            >
              <p>Delete</p>
              <img
                style={{
                  width: "20px",
                  height: "20px",
                }}
                src="/delete-icon.png"
                alt="clock"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
