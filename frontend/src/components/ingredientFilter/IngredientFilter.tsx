import React from "react";
import { useSelector } from "react-redux";
import {
  getIngredients,
  handleTypedIngredient,
  removeFilter,
  selectApp,
  setSelectedIngredients,
} from "../../redux/app/appSlice";
import store from "../../redux/store";
import styles from "./css/IngredientFilter.module.css";

const IngredientFilter = () => {
  const {
    selectedIngredients,
    ingredients,
    typedIngredient,
    filteredIngredients,
  } = useSelector(selectApp);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const [isFocused, setIsFocused] = React.useState(false);

  React.useEffect(() => {
    store.dispatch(getIngredients());
  }, []);

  React.useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [selectedIngredients]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    store.dispatch(handleTypedIngredient(e.target.value));
  };

  return (
    <>
      <div className={styles.container}>
        <div
          onClick={() => setIsFocused(true)}
          suppressContentEditableWarning
          spellCheck={false}
          data-gramm="false"
          data-gramm_editor="false"
          data-enable-grammarly="false"
          className={`${styles.box} ${styles.d_flex}`}
        >
          {selectedIngredients.map((el) => {
            return <p className={styles.pills}>{el}</p>;
          })}
          {!isFocused ? (
            <p
              style={{
                flex: "2",
              }}
            >
              Type ingredients
            </p>
          ) : (
            <input
              style={{
                outline: "none",
                border: "none",
                fontFamily: "var(--font-family)",
              }}
              onChange={(e) => handleChange(e)}
              autoFocus
              ref={inputRef}
              value={typedIngredient}
              className={styles.pills}
              type="text"
            />
          )}
        </div>
        <div>
          {isFocused && (
            <div
              onClick={() => setIsFocused(true)}
              contentEditable={isFocused ? true : false}
              spellCheck={false}
              data-gramm="false"
              data-gramm_editor="false"
              data-enable-grammarly="false"
              className={`${styles.box} ${styles.d_flex}`}
            >
              {typedIngredient
                ? filteredIngredients.map((el) => {
                    return (
                      <p
                        onClick={() =>
                          store.dispatch(
                            setSelectedIngredients(el.ingredientName)
                          )
                        }
                        contentEditable={false}
                        className={styles.pills}
                      >
                        {el.ingredientName}
                      </p>
                    );
                  })
                : ingredients.slice(0, 6).map((el) => {
                    return (
                      <p
                        onClick={() =>
                          store.dispatch(
                            setSelectedIngredients(el.ingredientName)
                          )
                        }
                        contentEditable={false}
                        className={styles.pills}
                      >
                        {el.ingredientName}
                      </p>
                    );
                  })}
              {typedIngredient && filteredIngredients.length == 0 && (
                <p style={{
                  lineHeight: "1.5em"
                }}>No Ingredient found. Please type something else.</p>
              )}
            </div>
          )}
        </div>
      </div>
      {isFocused && (
        <p
          onClick={() => {
            setIsFocused(false);
            store.dispatch(removeFilter());
          }}
          className={styles.remove_button}
        >
          Remove Filter
        </p>
      )}
    </>
  );
};

export default IngredientFilter;
