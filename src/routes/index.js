import { Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";

// layouts
import DashboardLayout from "../layouts/dashboard";

// config
import { DEFAULT_PATH } from "../config";
import LoadingScreen from "../components/LoadingScreen";
import AuthLayout from "../layouts/auth";

const Loadable = (Component) => (props) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        { path: "login", element: <LoginPage /> },
        { path: "register", element: <RegisterPage /> },
        { path: "reset-password", element: <ResetPasswordPage /> },
        { path: "new-password", element: <NewPasswordPage /> },
        { path: "verify", element: <VerifyPage /> },
      ]
    },
    {
      path: "/",
      element: <DashboardLayout />,
      children: [
        // bunu yazdigimiza gore  " http://localhost:3000/  "  entere basdigimizda otomatikmen /app  adresine gedir 
        { element: <Navigate to={DEFAULT_PATH} replace />, index: true },
        { path: "app", element: <GeneralApp /> },
        { path: "group", element: <Group /> },
        { path: "call", element: <Call /> },
        { path: "profile", element: <Profile /> },
        { path: "settings", element: <Settings /> },
        { path: "404", element: <Page404 /> },
        { path: "*", element: <Navigate to="/404" replace /> },
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}

const GeneralApp = Loadable(lazy(() => import("../pages/dashboard/GeneralApp")),);
const Page404 = Loadable(lazy(() => import("../pages/Page404")));

// auth
const LoginPage = Loadable(lazy(() => import("../pages/auth/Login")));
const RegisterPage = Loadable(lazy(() => import("../pages/auth/Register")));
const ResetPasswordPage = Loadable(lazy(() => import("../pages/auth/ResetPassword")))
const NewPasswordPage = Loadable(lazy(() => import("../pages/auth/NewPassword")));
const VerifyPage = Loadable(lazy(() => import("../pages/auth/Verify")));


const Group = Loadable(lazy(() => import("../pages/dashboard/Group")));
const Call = Loadable(lazy(() => import("../pages/dashboard/Calll")));


// Settings
const Settings = Loadable(lazy(() => import("../pages/dashboard/Settings")));
const Profile = Loadable(lazy(() => import("../pages/dashboard/Settings/Profile")))