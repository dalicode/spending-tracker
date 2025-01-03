import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  route("/", "routes/main/Layout.tsx", [
    index("routes/main/Overview.tsx"),
    route("spending", "routes/main/Spending.tsx"),
  ]),
  route("login", "routes/Login.tsx"),
  route("register", "routes/Register.tsx"),
] satisfies RouteConfig;
