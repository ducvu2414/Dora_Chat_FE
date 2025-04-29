import React, { Suspense } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicRoute } from "@/components/PublicRoute";
import path from "path";

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Lazy load components
const MainLayout = React.lazy(() => import("@/components/layouts/MainLayout"));
const LoginPage = React.lazy(() => import("@/page/LoginPage"));
const SignUpPage = React.lazy(() => import("@/page/SignUpStep1Page"));
const HomePage = React.lazy(() => import("@/page/HomePage"));
const SignUpStep3Page = React.lazy(() => import("@/page/SignUpStep3Page"));
const SignUpStep2Page = React.lazy(() => import("@/page/SignUpStep2Page"));
const SignUpStep4Page = React.lazy(() => import("@/page/SignUpStep4Page"));
const ResetPassStep1Page = React.lazy(() => import("@/page/ResetPassStep1Page"));
const ResetPass = React.lazy(() => import("@/page/ResetPassStep2Page"));

const ChatSingle = React.lazy(() => import("@/features/chat"));
const FriendInformationPage = React.lazy(() => import("@/page/FriendInformationPage"));
const UserInformationPage = React.lazy(() => import("@/page/UserInformationPage"));
const ContactsPage = React.lazy(() => import("@/page/ContactsPage"));
const OtherPeopleInformation = React.lazy(() => import("@/page/OtherPeopleInformationPage"));
const PreviewPage = React.lazy(() => import("@/page/PreviewPage"));

const CallPage = React.lazy(() => import("@/features/chat/CallPage"));
const GroupCallPage = React.lazy(() => import("@/features/chat/GroupCallPage"));


const withSuspense = (Component) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

const routes = [
  {
    path: "/",
    element: <PublicRoute>{withSuspense(LoginPage)}</PublicRoute>
  },
  {
    path: "/login",
    element: <PublicRoute>{withSuspense(LoginPage)}</PublicRoute>
  },
  {
    path: "/signup",
    element: <PublicRoute>{withSuspense(SignUpPage)}</PublicRoute>
  },
  {
    path: "/signup/otp",
    element: <PublicRoute>{withSuspense(SignUpStep3Page)}</PublicRoute>
  },
  {
    path: "/signup/info",
    element: <PublicRoute>{withSuspense(SignUpStep2Page)}</PublicRoute>
  },
  {
    path: "/signup/complete",
    element: <PublicRoute>{withSuspense(SignUpStep4Page)}</PublicRoute>
  },
  {
    path: "/reset-password/contact",
    element: <PublicRoute>{withSuspense(ResetPassStep1Page)}</PublicRoute>
  },
  {
    path: "/reset-password",
    element: <PublicRoute>{withSuspense(ResetPass)}</PublicRoute>
  },
  {
    path: "/preview",
    element: withSuspense(PreviewPage)
  },

  // Protected Routes with MainLayout
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <MainLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        path: "home",
        element: withSuspense(HomePage)
      },
      {
        path: "chat/:id",
        element: withSuspense(ChatSingle)
      },
      {
        path: "call/:conversationId",
        element: withSuspense(CallPage)
      }
      ,
      {
        path: "group-call/:conversationId",
        element: withSuspense(GroupCallPage)
      }
      ,
      {
        path: "user-information",
        element: withSuspense(UserInformationPage)
      },
      {
        path: "contacts",
        element: withSuspense(ContactsPage)
      },
      {
        path: "friend-information",
        element: withSuspense(FriendInformationPage)
      },
      {
        path: "other-people-information",
        element: withSuspense(OtherPeopleInformation)
      },
    ]
  },
];

export default routes;