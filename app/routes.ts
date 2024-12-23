import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  route("/", "routes/main/layout.tsx", [
    index("routes/main/overview.tsx"),
    route("spending", "routes/main/spending.tsx"),
  ]),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
] satisfies RouteConfig;
