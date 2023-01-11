import jwt_decode from "jwt-decode";

export const isTokenExpired = (accessToken: string) => {
  const decoded: any = jwt_decode(accessToken);
  if (decoded.exp * 1000 < Date.now()) {
    return true;
  }
  return false;
};
