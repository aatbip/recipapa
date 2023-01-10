import axios from "axios";
import Cookies from "js-cookie";
import "./App.css";
import { setUser, unSetUser } from "./redux/auth/authSlice";
import store from "./redux/store";
import Router from "./routes";
import { redirect, useLocation, useNavigate } from "react-router-dom";
import React from "react";

const App: React.FC = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const verifySession = async () => {
    const userCredentials = Cookies.get("userCredentials");
    if (userCredentials) {
      store.dispatch(setUser(JSON.parse(userCredentials)));
      if (location.pathname == "/") {
        navigate("/app", { replace: true });
      } else {
        navigate(location.pathname);
      }
      return;
    }
    store.dispatch(unSetUser());
    navigate("/");
  };

  React.useEffect(() => {
    verifySession();
  }, []);

  return <Router />;
};

export default App;
