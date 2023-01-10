import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectAuth } from "../../redux/auth/authSlice";

interface IProp {
  children: any;
}

const Authorize: React.FC<IProp> = ({ children }) => {
  const { isLoggedIn } = useSelector(selectAuth);
  return isLoggedIn ? children : <Navigate to={"/"} replace />;
};

export default Authorize;
