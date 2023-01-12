import React from "react";
import { useSelector } from "react-redux";
import { createSearchParams, useNavigate, useParams } from "react-router-dom";
import IngredientFilter from "../../components/ingredientFilter/IngredientFilter";
import SearchBox from "../../components/search/SearchBox";
import { searchRecipe, selectApp } from "../../redux/app/appSlice";
import { getOneRecipe } from "../../redux/app/appSlice";
import store from "../../redux/store";
import styles from "./css/RecipeDetails.module.css";
import searchStyles from "../searchPage/css/SearchPage.module.css";
import { RecipeIngredient } from "../../interfaces/recipe.ingerface";
import ImageSlider from "../../components/imageSlider/ImageSlider";
import { ScrollToTop } from "../../utils/Scroll";

const RecipeDetails = () => {
  const { recipeId } = useParams();
  const { recipeDetail } = useSelector(selectApp);

  React.useEffect(() => {
    if (recipeId) store.dispatch(getOneRecipe(recipeId));
  }, []);

  const { searchKeyword, selectedIngredients, isLoading, queryFilteredRecipe } =
    useSelector(selectApp);

  const navigate = useNavigate();

  const handleSearch = () => {
    store.dispatch(searchRecipe({ searchKeyword, selectedIngredients }));

    navigate({
      pathname: "/app/search/",
      search: `${createSearchParams({
        searchKeyword: searchKeyword,
        selectedIngredients: selectedIngredients
          .toString()
          .replace(" ", "-")
          .replace(",", "_"),
      }).toString()}`,
    });
  };

  const handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [searchKeyword, selectedIngredients]);

  return (
    <div className={styles.container}>
      <ScrollToTop />
      <div className={styles.wrapper}>
        <div className={searchStyles.search_container}>
          <div className={searchStyles.order_two}>
            <SearchBox />
          </div>
          <div className={searchStyles.order_three}>
            <IngredientFilter />
          </div>
          <button onClick={handleSearch} type="button" className="button-main">
            Find Recipe
          </button>
        </div>

        <hr />

        <div className={styles.content_wrapper}>
          <ImageSlider images={recipeDetail.images} />

          <h1 className={styles.title}>{recipeDetail.title}</h1>
          <p
            style={{
              color: "#2e2e2e",
            }}
            className={styles.content_text}
          >
            by {recipeDetail.userId}
          </p>
          <div
            style={{
              display: "flex",
              gap: "5px",
              alignItems: "center",
            }}
          >
            <img src="/clock.svg" alt="duration" />
            <p className={styles.content_text}>{recipeDetail.duration}</p>
          </div>
          <p className={styles.content_text}>{recipeDetail.shortDescription}</p>
          <p className={styles.content_text}>{recipeDetail.introduction}</p>
          <p className={styles.sub_title}>Ingredients</p>

          {recipeDetail.ingredients &&
            recipeDetail.ingredients.map((el: any) => {
              return (
                <p className={styles.content_text}>
                  {el.ingredientName} -<span>{el.quantity}</span>
                </p>
              );
            })}

          <p className={styles.sub_title}>Steps</p>
          {recipeDetail.steps.map((el, ind) => {
            return (
              <>
                <p
                  className={styles.sub_title}
                  style={{
                    fontSize: "18px",
                    fontWeight: "500",
                  }}
                >
                  Step {ind + 1}
                </p>
                <p className={styles.content_text}>{el}</p>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
