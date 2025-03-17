import React from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicRoute } from "@/components/PublicRoute";

const LoginPage = React.lazy(() => import("@/page/LoginPage"));
const SignUpPage = React.lazy(() => import("@/page/SignUpStep1Page"));
const HomePage = React.lazy(() => import("@/page/HomePage"));
const SignUpStep3Page = React.lazy(() => import("@/page/SignUpStep3Page"));
const SignUpStep2Page = React.lazy(() => import("@/page/SignUpStep2Page"));
const SignUpStep4Page = React.lazy(() => import("@/page/SignUpStep4Page"));
const ResetPassStep1Page = React.lazy(() =>
  import("@/page/ResetPassStep1Page")
);
const ResetPass = React.lazy(() => import("@/page/ResetPassStep2Page"));

const ChatSingle = React.lazy(() => import("@/features/chat"));
const FriendInformationPage = React.lazy(() =>
  import("@/page/FriendInformationPage")
);
const UserInformationPage = React.lazy(() =>
  import("@/page/UserInformationPage")
);
const ContactsPage = React.lazy(() => import("@/page/ContactsPage"));
const OtherPeopleInformation = React.lazy(() =>
  import("@/page/OtherPeopleInformationPage")
);

const routes = [
  {
    path: "/",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <SignUpPage />
      </PublicRoute>
    ),
  },
  {
    path: "/signup/otp",
    element: (
      <PublicRoute>
        <SignUpStep3Page />
      </PublicRoute>
    ),
  },
  {
    path: "/signup/info",
    element: (
      <PublicRoute>
        <SignUpStep2Page />
      </PublicRoute>
    ),
  },
  {
    path: "/signup/complete",
    element: (
      <PublicRoute>
        <SignUpStep4Page />
      </PublicRoute>
    ),
  },
  {
    path: "/reset-password/contact",
    element: (
      <PublicRoute>
        <ResetPassStep1Page />
      </PublicRoute>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <PublicRoute>
        <ResetPass />
      </PublicRoute>
    ),
  },

  // Protected Routes
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/chat/:id",
    element: (
      <ProtectedRoute>
        <ChatSingle />
      </ProtectedRoute>
    ),
  },
  {
    path: "/user-information",
    element: (
      <ProtectedRoute>
        <UserInformationPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/contacts",
    element: (
      <ProtectedRoute>
        <ContactsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/friend-information",
    element: (
      <ProtectedRoute>
        <FriendInformationPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/other-people-information",
    element: (
      <ProtectedRoute>
        <OtherPeopleInformation />
      </ProtectedRoute>
    ),
  },
];

export default routes;
