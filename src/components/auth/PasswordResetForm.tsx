
import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "./AuthForm";
import { requestPasswordReset } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

export function PasswordResetForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = async (formData: Record<string, string>) => {
    try {
      setIsSubmitting(true);
      await requestPasswordReset(formData.email);
      setIsSubmitted(true);
      toast({
        title: "Check your email",
        description: "If an account exists, we've sent password reset instructions.",
      });
    } catch (error) {
      // For security reasons, we don't want to reveal if an email exists or not
      setIsSubmitted(true);
      toast({
        title: "Check your email",
        description: "If an account exists, we've sent password reset instructions.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    {
      id: "email",
      label: "Email address",
      type: "email",
      autoComplete: "email",
      required: true,
    },
  ];

  if (isSubmitted) {
    return (
      <div className="text-center animate-fade-in">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-3 text-base font-semibold text-gray-900 dark:text-white">Check your email</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          We've sent password reset instructions to your email address.
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => navigate("/signin")}
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Return to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthForm
      fields={fields}
      onSubmit={handleSubmit}
      submitLabel="Reset password"
      isSubmitting={isSubmitting}
    />
  );
}

export default PasswordResetForm;
