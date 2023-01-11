import axios from "axios";
import React, { ChangeEvent, SyntheticEvent } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ImageUploader from "../../components/imageUploader/ImageUploader";
import Spinner from "../../components/spinner/Spinner";
import { Ingredient } from "../../interfaces/recipe.ingerface";
import {
  addRecipeIngredient,
  createIngredient,
  getIngredients,
  getOneRecipe,
  handleIngredientSuggestion,
  handleRecipeContent,
  removeImage,
  removeNewIngredient,
  removeRecipeIngredient,
  removeSteps,
  removeSuggestedIngredient,
  resetForm,
  selectRecipe,
} from "../../redux/recipe/recipeSlice";
import store from "../../redux/store";
import styles from "./css/CreateRecipe.module.css";

const CreateRecipe: React.FC = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();

  const {
    suggestedIngredients,
    newIngredient,
    recipeIngredients,
    recipeContents,
    uploadedImages,
  } = useSelector(selectRecipe);

  const [inputValue, setInputValue] = React.useState("");
  const [steps, setSteps] = React.useState("");
  const [previewImage, setPreviewImage] = React.useState<Array<string>>([]);
  const [isUploading, setIsUploading] = React.useState<boolean>(false);

  const [recipeIngredient, setRecipeIngredient] = React.useState({
    ingredientName: "",
    quantity: "",
  });

  const handlePreviewImage = (index: number) => {
    setPreviewImage((prev) => prev.filter((el, ind) => ind !== index));
    store.dispatch(removeImage(index));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name === "images")
      if (files) {
        for (let i = 0; i < files.length; i++) {
          previewImage.push(URL.createObjectURL(files[i]));
        }
      }

    store.dispatch(handleRecipeContent({ name, value, files }));
  };

  React.useEffect(() => {
    store.dispatch(resetForm());
    store.dispatch(getIngredients());

    if (recipeId) store.dispatch(getOneRecipe(recipeId));
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (
      !recipeContents.title ||
      !recipeContents.duration ||
      !recipeContents.introduction ||
      !recipeContents.shortDescription ||
      recipeContents.steps.length === 0 ||
      recipeIngredients.length === 0
    ) {
      toast.error("Please enter all fields!");
      return;
    }

    const formData = new FormData();

    formData.append("title", recipeContents.title);
    formData.append("duration", recipeContents.duration);
    formData.append("shortDescription", recipeContents.shortDescription);

    formData.append("introduction", recipeContents.introduction);
    formData.append("ingredients", JSON.stringify(recipeIngredients));
    formData.append("steps", JSON.stringify(recipeContents.steps));

    Object.values(recipeContents.images).forEach((file) => {
      formData.append("images", file);
    });

    if (recipeId !== undefined) {
      formData.append("uploadedImages", JSON.stringify(uploadedImages));

      try {
        setIsUploading(true);
        await axios.patch(`/recipe/${recipeId}`, formData);
        setIsUploading(false);
        toast.success("Your recipe is updated!");
        navigate(-1);
        store.dispatch(resetForm());
      } catch (error: any) {
        console.log(error);
      }
    } else {
      if (recipeContents.images.length === 0) {
        toast.error("Please add some images!");
        return;
      }

      try {
        setIsUploading(true);
        await axios.post(`/recipe/add/`, formData);
        setIsUploading(false);
        toast.success("Your new recipe is added!");
        navigate(-1);
        store.dispatch(resetForm());
      } catch (error: any) {
        console.log(error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <hr />
        <div className={styles.header}>
          <aside>
            <img
              onClick={() => navigate(-1)}
              src="/left-arrow.svg"
              alt="left-arrow"
            />
            <h1>Create Recipe</h1>
          </aside>
          <button
            className="button-main"
            type="button"
            onClick={(e) => handleSubmit(e)}
          >
            Save Recipe &#10003;
          </button>
        </div>

        <div className={styles.create_recipe_form}>
          <Spinner isLoading={isUploading} positionAbsolute />
          <p>Recipe Title</p>
          <input
            type="text"
            name="title"
            placeholder="Chicken Curry"
            value={recipeContents.title}
            onChange={(e) => handleChange(e)}
          />
          <p>Duration</p>
          <input
            type="text"
            name="duration"
            placeholder="40 mins"
            value={recipeContents.duration}
            onChange={(e) => handleChange(e)}
          />
          <p>Short Description</p>
          <input
            type="text"
            name="shortDescription"
            value={recipeContents.shortDescription}
            placeholder="Chicken curry with less oil and fat"
            onChange={(e) => handleChange(e)}
          />
          <ImageUploader
            handleChange={handleChange}
            previewImage={previewImage}
            handlePreviewImage={handlePreviewImage}
          />
          <p>Introduction</p>
          <textarea
            name="introduction"
            value={recipeContents.introduction}
            onChange={(e) => handleChange(e)}
          />
          <p>Ingredients</p>
          <div className={`${styles.d_flex}`}>
            <div>
              <p
                style={{
                  fontSize: "var(--font-size-small)",
                }}
              >
                Ingredient Name
              </p>
              <input
                type="text"
                name="ingredientName"
                placeholder="Type your ingredient"
                value={inputValue}
                autoComplete="off"
                onChange={(e) => {
                  setInputValue(e.target.value);
                  store.dispatch(handleIngredientSuggestion(e.target.value));
                }}
                style={{
                  width: "100%",
                }}
              />
              <ul>
                {suggestedIngredients.length > 0 &&
                  suggestedIngredients.map((ingredient: Ingredient) => {
                    return (
                      <li
                        onClick={() => {
                          setRecipeIngredient((prev) => {
                            return {
                              ...prev,
                              ingredientName: ingredient.ingredientName,
                            };
                          });
                          setInputValue(ingredient.ingredientName);
                          store.dispatch(removeSuggestedIngredient()); 
                        }}
                        className={styles.ingredient_list}
                      >
                        {ingredient.ingredientName}
                      </li>
                    );
                  })}

                {newIngredient && (
                  <li
                    onClick={() => {
                      store.dispatch(createIngredient(newIngredient));
                      setRecipeIngredient((prev) => {
                        return {
                          ...prev,
                          ingredientName: newIngredient,
                        };
                      });
                      setInputValue(newIngredient);
                      store.dispatch(removeNewIngredient()); 
                    }}
                    className={styles.ingredient_list}
                  >
                    Add {newIngredient}?
                  </li>
                )}
              </ul>
            </div>
            <div>
              <p
                style={{
                  fontSize: "var(--font-size-small)",
                }}
              >
                Ingredient Quantity
              </p>
              <input
                onChange={(e) => {
                  setRecipeIngredient((prev) => {
                    return {
                      ...prev,
                      quantity: e.target.value,
                    };
                  });
                }}
                type="text"
                name="quantity"
                value={recipeIngredient.quantity}
                style={{
                  width: "100%",
                }}
              />
            </div>
            <button
              onClick={() => {
                if (
                  !recipeIngredient.ingredientName ||
                  !recipeIngredient.quantity
                ) {
                  toast.error("Please add Ingredient name and quantity!");
                  return;
                }
                store.dispatch(addRecipeIngredient(recipeIngredient));
                setRecipeIngredient({
                  ingredientName: "",
                  quantity: "",
                });
                setInputValue("");
              }}
              type="button"
              className={styles.ingredient_list}
              style={{
                height: "40px",
                padding: "10px 20px",
                marginTop: "3em",
              }}
            >
              Add
            </button>
          </div>
          <div
            className={`${styles.d_flex}`}
            style={{
              width: "285px",
              flexWrap: "wrap",
            }}
          >
            {recipeIngredients.map((el) => {
              return (
                <div>
                  <p
                    style={{
                      fontSize: "var(--font-size-small)",
                      border: "1px solid var(--color-variant-gray)",
                      padding: "10px 20px",
                      borderRadius: "10px",
                    }}
                  >
                    {el.ingredientName}
                    <span
                      style={{
                        marginLeft: "5px",
                      }}
                    >
                      {el.quantity}
                      <span
                        onClick={() =>
                          store.dispatch(
                            removeRecipeIngredient(el.ingredientName)
                          )
                        }
                        style={{
                          color: "red",
                          marginLeft: "5px",
                          cursor: "pointer",
                        }}
                      >
                        &#10005;
                      </span>
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
          <p>Steps</p>
          <div className={`${styles.d_flex}`}>
            <input
              type="text"
              name="steps"
              value={steps}
              placeholder="Type steps"
              onChange={(e) => setSteps(e.target.value)}
            />
            <button
              type="button"
              onClick={() => {
                store.dispatch(handleRecipeContent({ steps: steps }));
                setSteps("");
              }}
              className={styles.ingredient_list}
              style={{
                height: "40px",
                padding: "10px 20px",
              }}
            >
              Add{" "}
            </button>
          </div>
          {recipeContents.steps.map((el: string, ind: number) => {
            return (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "350px",
                    alignItems: "center",
                    padding: "10px 0px",
                    fontSize: "var(--font-size-small)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "var(--font-size-small)",
                    }}
                  >
                    Step {ind + 1}
                  </p>
                  <p
                    style={{
                      color: "red",
                      marginLeft: "5px",
                      cursor: "pointer",
                      fontSize: "var(--font-size-small)",
                    }}
                    onClick={() => store.dispatch(removeSteps(el))}
                  >
                    Delete &#10005;{" "}
                  </p>
                </div>
                <p
                  style={{
                    color: "var(--color-variant-gray)",
                    fontSize: "var(--font-size-small)",
                  }}
                >
                  {el}
                </p>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CreateRecipe;
