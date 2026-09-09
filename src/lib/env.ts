export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
  allowUnauth: process.env.NEXT_PUBLIC_ALLOW_UNAUTH === "true",
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
};
