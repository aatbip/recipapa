import React from "react";
import { useSelector } from "react-redux";
import { handleUploadedImage, selectRecipe } from "../../redux/recipe/recipeSlice";
import store from "../../redux/store";
import styles from "./css/ImageUpload.module.css";

interface Prop {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewImage: string[];
  handlePreviewImage: (index: number) => void;
}

const ImageUploader: React.FC<Prop> = ({
  handleChange,
  previewImage,
  handlePreviewImage,
}) => {
  const { isLoading, uploadedImages } = useSelector(selectRecipe);

  return (
    <>
      <p>Images</p>
      <label className={styles.formLabel} htmlFor="files">
        Select Product Image
      </label>
      <input
        onChange={(e) => handleChange(e)}
        name="images"
        type="file"
        id="files"
        multiple
        style={{
          display: "none",
        }}
      />

      <div className={styles.image_container}>
        {previewImage.length > 0 &&
          previewImage.map((img, ind) => {
            return (
              <>
                <img className={styles.image} src={img} alt={img} />
                <p onClick={() => handlePreviewImage(ind)}>&#10060;</p>
              </>
            );
          })}

        {isLoading ? (
          <></>
        ) : (
          uploadedImages.length > 0 &&
          uploadedImages.map((img, ind) => {
            return (
              <>
                <img
                  className={styles.image}
                  src={`${process.env.REACT_APP_API_KEY}/recipe/${img}`}
                  alt={img}
                />
                <p onClick={() => store.dispatch(handleUploadedImage(ind))}>&#10060;</p>
              </>
            );
          })
        )}
      </div>
    </>
  );
};

export default ImageUploader;
