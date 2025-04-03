
import { Link } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { PasswordResetForm } from "@/components/auth/PasswordResetForm";

const ResetPassword = () => {
  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll send you instructions to reset your password"
      footer={
        <p>
          Remember your password?{" "}
          <Link to="/signin" className="font-semibold text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      }
    >
      <PasswordResetForm />
    </AuthLayout>
  );
};

export default ResetPassword;
