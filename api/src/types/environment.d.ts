export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      NODE_ENV: "development" | "production";
      MONGO_URI: string;
      JWT_SECRET: string;
      ACCESS_TOKEN_LIFETIME: string;
      REFRESH_TOKEN_LIFETIME: string;
      FRONTEND_URL: string;
    }
  }
}
