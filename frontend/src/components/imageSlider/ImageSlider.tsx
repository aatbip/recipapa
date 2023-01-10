import React from "react";
import styles from "./css/ImageSlider.module.css";

interface Prop {
  images: string[];
}

const ImageSlider: React.FC<Prop> = ({ images }) => {
  const [currentImage, setCurrentImage] = React.useState(0);

  const handleRight = () => {
    if (currentImage === images.length - 1) {
      setCurrentImage(0);
      return;
    }
    setCurrentImage((prev) => prev + 1);
  };

  const handleLeft = () => {
    if (currentImage === 0) {
      setCurrentImage(images.length - 1);
      return;
    }

    setCurrentImage((prev) => prev - 1);
  };

  return (
    <div className={styles.wrapper}>
      <img
        className={styles.image}
        src={`${process.env.REACT_APP_API_KEY}/recipe/${images[currentImage]}`}
        alt={images[currentImage]}
      />

      <img
        onClick={handleLeft}
        className={styles.left}
        src="/kebab-left.svg"
        alt="left-arrow"
      />
      <img
        onClick={handleRight}
        className={styles.right}
        src="/kebab-right.svg"
        alt="right-arrow"
      />
    </div>
  );
};

export default ImageSlider;
