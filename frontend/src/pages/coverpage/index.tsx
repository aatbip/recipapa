import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Login from "../../components/login/Login";
import { selectAuth } from "../../redux/auth/authSlice";
import styles from "./css/CoverPage.module.css";

const CoverPage = () => {
  const location = useLocation();

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.heading}>Let's Cook Something Delicious Today</h1>
        {location.pathname === "/signup" ? (
          <Login isSignUp={true} />
        ) : (
          <Login isSignUp={false} />
        )}
      </div>
    </div>
  );
};

export default CoverPage;
