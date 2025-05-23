import { lazy } from "react";
import Admin from "@pages/Admin/Admin";

const routers = [
  {
    path: "/",
    component: lazy(() => import("@pages/HomePage/HomePage")),
  },
  {
    path: "/login",
    component: lazy(() => import("@pages/Login/Login")),
  },
  {
    path: "/register",
    component: lazy(() => import("@pages/Register/Register")),
  },
  { path: "/admin", component: Admin },
  ,
  {
    path: "/callback",
    component: lazy(() => import("@components/CallBack/Callback")),
  },
  {
    path: "/detail/:slug",
    component: lazy(() => import("@pages/Detail/Detail")),
  },

  {
    path: "/category/:categoryId",
    component: lazy(() => import("@pages/CategoryPage/CategoryPage")),
  },
];

export default routers;
