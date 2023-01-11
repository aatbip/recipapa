import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { Navigate, useNavigate } from "react-router-dom";
import { isTokenExpired } from "../utils/checkTokenExpired";

axios.defaults.baseURL = `${process.env.REACT_APP_API_KEY}/api`;

axios.defaults.withCredentials = true;

const ax = axios.create();

axios.interceptors.request.use(async (req: any) => {
  const credentials = Cookies.get("userCredentials");
  if (credentials) {
    let data = JSON.parse(credentials);
    if (isTokenExpired(data.accessToken)) {
      let accessToken = await setNewAccessToken(data.refreshToken);
      req.headers.authorization = `Bearer ${accessToken} `;
      return req;
    }
    req.headers.authorization = `Bearer ${data.accessToken} `;
  }
  return req;
});

const setNewAccessToken = async (refreshToken: string) => {
  const res = await ax.post("/auth/refresh", {
    refreshToken: refreshToken,
  });
  console.log(res); 
  const userCredentials = res.data;
  Cookies.set("userCredentials", JSON.stringify(userCredentials));
  return userCredentials.accessToken;
};
