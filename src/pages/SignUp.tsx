
import { Link } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { SignUpForm } from "@/components/auth/SignUpForm";

const SignUp = () => {
  return (
    <AuthLayout
      title="Create an account"
      subtitle="Sign up to get started with our service"
      footer={
        <p>
          Already have an account?{" "}
          <Link to="/signin" className="font-semibold text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      }
    >
      <SignUpForm />
    </AuthLayout>
  );
};

export default SignUp;
