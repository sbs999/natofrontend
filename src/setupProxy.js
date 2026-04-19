const { createProxyMiddleware } = require("http-proxy-middleware");

const DEFAULT_TARGET = "https://natobackend.onrender.com";

/** Path prefixes the Express API uses (must match natobackend/src/app.ts + routers). */
const API_PREFIXES = [
  "/signIn",
  "/getPerson",
  "/getPersonsFromHistory",
  "/personMarkDetails",
  "/setPersonAdminMark",
  "/addPerson",
  "/updatePerson",
  "/removePerson",
  "/deleteActivePerson",
  "/addMoney",
  "/payMoney",
  "/getTotalMoney",
  "/getNote",
  "/postNote",
  "/statistics",
  "/media",
  "/products-to-bring",
  "/products-with-prices",
];

/**
 * Used only when the browser uses relative API URLs (REACT_APP_BACKEND_URL unset).
 * If you use a direct backend URL in .env.development, axios skips the dev server entirely.
 */
module.exports = function (app) {
  const fromEnv = process.env.REACT_APP_BACKEND_URL;
  const target =
    fromEnv && String(fromEnv).trim()
      ? String(fromEnv).trim().replace(/\/$/, "")
      : DEFAULT_TARGET;

  app.use(
    createProxyMiddleware(API_PREFIXES, {
      target,
      changeOrigin: true,
      secure: target.startsWith("https"),
    })
  );
};
