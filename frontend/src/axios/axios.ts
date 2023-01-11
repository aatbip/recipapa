import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { Navigate, useNavigate } from "react-router-dom";
import { isTokenExpired } from "../utils/checkTokenExpired";

axios.defaults.baseURL = "http://localhost:5000/api";
// axios.defaults.baseURL = "https://recipapa.onrender.com/api";
axios.defaults.withCredentials = true;

const ax = axios.create();

axios.interceptors.request.use(async (req: any) => {
  const credentials = Cookies.get("userCredentials");
  if (credentials) {
    const data = JSON.parse(credentials);
    if (isTokenExpired(data.accessToken)) {
      setNewAccessToken(data.refreshToken);
    }
    req.headers.authorization = `Bearer ${data.accessToken} `;
    return req;
  }
  return req;
});

const setNewAccessToken = async (refreshToken: string) => {
  const res = await ax.post("/auth/refresh", {
    refreshToken: refreshToken,
  });
  const userCredentials = res.data; 
  Cookies.set("userCredentials", JSON.stringify(userCredentials)); 
  console.log("refresh", res.data);
};
