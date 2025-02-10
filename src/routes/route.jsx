import React from "react";

const LoginPage = React.lazy(() => import("@/page/LoginPage"));
const SignUpPage = React.lazy(() => import("@/page/SignUpStep1Page"));
const HomePage = React.lazy(() => import("@/page/HomePage"));
const SignUpStep2Page = React.lazy(() => import("@/page/SignUpStep2Page"));
const SignUpStep3Page = React.lazy(() => import("@/page/SignUpStep3Page"));
const SignUpStep4Page = React.lazy(() => import("@/page/SignUpStep4Page"));
const FriendInformationPage = React.lazy(() => import("@/page/FriendInformationPage"));
const UserInformationPage = React.lazy(() => import("@/page/UserInformationPage"));
const ContactsPage = React.lazy(() => import("@/page/ContactsPage"));
const OtherPeopleInformation = React.lazy(() => import("@/page/OtherPeopleInformationPage"));

const routes = [
    { path: "/", element: <LoginPage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/signup", element: <SignUpPage /> },
    { path: "/signup/otp", element: <SignUpStep2Page /> },
    { path: "/signup/info", element: <SignUpStep3Page /> },
    { path: "/signup/complete", element: <SignUpStep4Page /> },
    { path: "/forgot-password", element: <div>Forgot Password Page</div> },
    { path: "/home", element: <HomePage /> },
    { path: "/user-information", element: <UserInformationPage /> },
    { path: "/contacts", element: <ContactsPage /> },
    { path: "/friend-information", element: <FriendInformationPage /> },
    { path: "/other-people-information", element: <OtherPeopleInformation /> },
];

export default routes;
