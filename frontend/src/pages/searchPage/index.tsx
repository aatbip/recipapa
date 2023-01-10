import React from "react";
import { useSelector } from "react-redux";
import { createSearchParams, useNavigate } from "react-router-dom";
import IngredientFilter from "../../components/ingredientFilter/IngredientFilter";
import RecipeCard from "../../components/recipeCard/RecipeCard";
import SearchBox from "../../components/search/SearchBox";
import { searchRecipe, selectApp } from "../../redux/app/appSlice";
import store from "../../redux/store";
import styles from "./css/SearchPage.module.css";

interface KeyboardEvent {
  key: string;
}

const SearchPage = () => {
  const { searchKeyword, selectedIngredients, isLoading, queryFilteredRecipe } =
    useSelector(selectApp);

  const navigate = useNavigate();

  const handleSearch = () => {
    store.dispatch(searchRecipe({ searchKeyword, selectedIngredients }));

    navigate({
      pathname: "",
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
      <div className={styles.wrapper}>
        <div className={styles.search_container}>
          <div className={styles.order_two}>
            <SearchBox />
          </div>
          <div className={styles.order_three}>
            <IngredientFilter />
          </div>
          <button onClick={handleSearch} type="button" className="button-main">
            Find Recipe
          </button>
        </div>
        <hr />

        <div className={styles.recipe_container}>
          <div className={styles.recipe_wrapper}>
            {isLoading ? (
              <></>
            ) : (
              queryFilteredRecipe.map((el, ind) => {
                return (
                  <>
                    <RecipeCard key={ind} isMyRecipe={false} recipe={el} />
                    <RecipeCard key={ind} isMyRecipe={false} recipe={el} />
                    <RecipeCard key={ind} isMyRecipe={false} recipe={el} />
                    <RecipeCard key={ind} isMyRecipe={false} recipe={el} />
                    <RecipeCard key={ind} isMyRecipe={false} recipe={el} />
                    <RecipeCard key={ind} isMyRecipe={false} recipe={el} />
                  </>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
