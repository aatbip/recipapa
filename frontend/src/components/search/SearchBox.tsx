import React from "react";
import { useSelector } from "react-redux";
import { handleSearchKeyword, selectApp } from "../../redux/app/appSlice";
import store from "../../redux/store";
import styles from "./css/SearchBox.module.css";

const SearchBox = () => {
  const { searchKeyword } = useSelector(selectApp);

  return (
    <div className={styles.container}>
      <input
        value={searchKeyword}
        onChange={(e) => store.dispatch(handleSearchKeyword(e.target.value))}
        type="text"
        name="search"
        placeholder="&#128269; Search"
      />
    </div>
  );
};

export default SearchBox;
