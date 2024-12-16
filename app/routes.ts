import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/overview.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("spending", "routes/spending.tsx"),
] satisfies RouteConfig;
