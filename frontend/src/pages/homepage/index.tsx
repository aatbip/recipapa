import React from "react";
import { useSelector } from "react-redux";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { URLSearchParams } from "url";
import IngredientFilter from "../../components/ingredientFilter/IngredientFilter";
import RecipeCard from "../../components/recipeCard/RecipeCard";
import SearchBox from "../../components/search/SearchBox";
import Spinner from "../../components/spinner/Spinner";
import {
  getAllRecipe,
  searchRecipe,
  selectApp,
} from "../../redux/app/appSlice";
import { selectAuth } from "../../redux/auth/authSlice";
import store from "../../redux/store";
import styles from "./css/Homepage.module.css";

interface KeyboardEvent {
  key: string;
}

const HomePage: React.FC = () => {
  const { username } = useSelector(selectAuth);
  const { isLoading, recipe, searchKeyword, selectedIngredients } =
    useSelector(selectApp);
  const navigate = useNavigate();

  const handleSearch = () => {
    store.dispatch(searchRecipe({ searchKeyword, selectedIngredients }));

    navigate({
      pathname: "search",
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

  React.useEffect(() => {
    store.dispatch(getAllRecipe());
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.tag}>
          <p>Hello, {username}</p>
          <img src="/images/strawberry.svg" alt="strawberry" />
        </div>
        <div className={styles.hero_section}>
          <div className={styles.left}>
            <h1>
              Find awesome recipes in just <span>nanoseconds</span>
            </h1>
            <p>
              Get hyped with trending recipes to almost any of your ingredients.
            </p>
            <div
              style={{
                marginTop: "40px",
                marginBottom: "40px",
              }}
            >
              <div className={styles.search_area}>
                <SearchBox />
                <button
                  onClick={handleSearch}
                  className="button-main"
                  type="button"
                >
                  Find Recipe
                </button>
              </div>

              <IngredientFilter />
            </div>
          </div>
          <img src="/images/hero-section-image.svg" alt="food-image" />
        </div>
        <div className={styles.head}>
          <p
            style={{
              color: "var(--color-variant-main)",
            }}
          >
            Whats Hot
          </p>
          <h1>Most Popular Recipes</h1>
        </div>
        <div className={styles.recipe_card_container}>
          {isLoading ? (
            <Spinner isLoading={isLoading} positionAbsolute={false} />
          ) : (
            recipe?.map((el) => {
              return (
                <>

                  <RecipeCard key={el._id} isMyRecipe={false} recipe={el} />
                </>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
