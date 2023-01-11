import React from "react";
import jwt_decode from "jwt-decode";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import store from "../redux/store";
import { setUser, unSetUser } from "../redux/auth/authSlice";
import Cookies from "js-cookie";
import { isTokenExpired } from "./checkTokenExpired";

interface Prop {
  children: React.ReactNode;
}

const VerifySession: React.FC<Prop> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const verifySession = async () => {
    const userCredentials = Cookies.get("userCredentials");
    if (userCredentials) {
      if (isTokenExpired(JSON.parse(userCredentials).refreshToken)) {
        store.dispatch(unSetUser());
        navigate("/");
        toast.error("Your token has expired. Please login again!");
        return;
      }
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

  return <>{children}</>;
};

export default VerifySession;
