
import { Link } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { SignInForm } from "@/components/auth/SignInForm";

const SignIn = () => {
  return (
    <AuthLayout
      title="Sign in to your account"
      footer={
        <div className="flex flex-col space-y-2">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </p>
          <p>
            <Link to="/reset-password" className="font-semibold text-blue-600 hover:text-blue-500">
              Forgot your password?
            </Link>
          </p>
        </div>
      }
    >
      <SignInForm />
    </AuthLayout>
  );
};

export default SignIn;
