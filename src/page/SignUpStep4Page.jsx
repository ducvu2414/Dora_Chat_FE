import Logo from "@/assets/dorachat_logo.png";
import SignUpBanner from "@/assets/signup.png";
import { ProgressSteps } from "@/components/ui//SignUp/ProgressSteps";
import { AlertMessage } from "@/components/ui//alert-message";
import { SignUpStep4Banner } from "@/components/ui//SignUp/SignUpStep4";

export default function SignUpStep4Page() {
  return (
    <div className="max-w-screen-2xl h-full w-full flex justify-center items-center bg-[#D8EDFF] h-screen">
      <div className="flex flex-col w-full h-full md:flex-row">
        {/* Left side - Form */}
        <div className="w-[150%] h-full p-4 md:p-8 lg:p-12 relative justify-center bg-white flex flex-col items-center">
          <div className="w-full max-w-md mx-auto space-y-10">
            {/* Alert Message */}
            {alert.message && (
              <AlertMessage type={alert.type} message={alert.message} />
            )}

            {/* Login link */}
            <div className="text-sm">
              You had an account?
              <a href="/login" className="ml-1 text-blue-600 hover:underline">
                Login
              </a>
            </div>

            {/* Logo */}
            <div className="flex justify-center">
              <img
                src={Logo}
                alt="Dora Logo"
                className="object-contain w-[350px] h-[65px]"
              />
            </div>

            {/* Welcome text */}
            <div className="space-y-4 text-center">
              <p className="text-gray-600">
                We&apos;re super excited to have you join our community.
              </p>
              <p className="text-gray-600">
                Let&apos;s dive into some fun conversations together!
              </p>
            </div>

            <ProgressSteps currentStep={4} />
          </div>
          <SignUpStep4Banner />
        </div>

        {/* Right side - Pattern */}
        <div className="items-center justify-center hidden w-full max-h-full rounded-2xl md:flex">
          <img
            src={SignUpBanner}
            alt="Sign Up Banner"
            className="object-cover w-[100%] max-h-[100%] rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
}
