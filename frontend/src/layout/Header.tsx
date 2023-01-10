import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectAuth, signOut, unSetUser } from "../redux/auth/authSlice";
import store from "../redux/store";
import styles from "./css/Layout.module.css";

const Header: React.FC = () => {
  const { username, userId } = useSelector(selectAuth);
  const navigate = useNavigate();

  const logout = () => {
    store.dispatch(signOut());
    store.dispatch(unSetUser());
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <img src="/recipapa-logo.svg" alt="recipapa" />
        <div className={styles.nav_items}>
          <p onClick={() => navigate("/app")}>Home</p>
          <button onClick={() => navigate(`myrecipe/${userId}`)} type="button">
            My Recipe
          </button>
          <img onClick={logout} src="/logout-logo.svg" alt="logout" />
        </div>
      </div>
    </div>
  );
};

export default Header;
