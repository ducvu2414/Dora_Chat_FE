import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import { Spinner } from "@/page/Spinner";

// Lazy load các trang để tối ưu hiệu suất
const HomePage = lazy(() => import("@/page/HomePage"));
const UserInformationPage = lazy(() => import("@/page/UserInformationPage"));
const FriendInformationPage = lazy(() =>
  import("@/page/FriendInformationPage")
);
// const OtherPeopleInformationPage = lazy(() =>
//   import("@/page/OtherPeopleInformationPage")
// );
const LoginPage = lazy(() => import("@/page/LoginPage"));
const SignUpStep1Page = lazy(() => import("@/page/SignUpStep1Page"));
// Import các trang khác...

const routes = [
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup/step1",
    element: <SignUpStep1Page />,
  },
  // Các route đăng nhập/đăng ký khác...

  // Các route sử dụng MainLayout
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "home",
        element: (
          <Suspense Suspense fallback={<Spinner />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: "user-information",
        element: (
          <Suspense fallback={<Spinner />}>
            <UserInformationPage />
          </Suspense>
        ),
      },
      {
        path: "friend-information",
        element: (
          <Suspense fallback={<Spinner />}>
            <FriendInformationPage />
          </Suspense>
        ),
      },
      // Thêm các route con khác...
    ],
  },
];

export default routes;
