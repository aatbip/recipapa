import axios from "axios";
import Cookies from "js-cookie";
import "./App.css";
import { setUser, unSetUser } from "./redux/auth/authSlice";
import store from "./redux/store";
import Router from "./routes";
import { redirect, useLocation, useNavigate } from "react-router-dom";
import React from "react";

const App: React.FC = () => {
  return <Router />;
};

export default App;
