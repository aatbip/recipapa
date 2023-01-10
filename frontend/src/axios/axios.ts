import axios from "axios";
import Cookies from "js-cookie";

axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;

axios.interceptors.request.use(function (req: any) {
  const credentials = Cookies.get("userCredentials");
  if (credentials) {
    const data = JSON.parse(credentials);
    req.headers.authorization = `Bearer ${data.accessToken} `;
    return req;
  }
  return req;
});
