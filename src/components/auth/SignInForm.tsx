
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "./AuthForm";
import { signIn } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

export function SignInForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (formData: Record<string, string>) => {
    try {
      setIsSubmitting(true);
      await signIn({
        email: formData.email,
        password: formData.password
      });
      toast({
        title: "Success",
        description: "You have successfully signed in.",
      });
      navigate("/store"); // Changed from /profile to /store
    } catch (error) {
      throw error;
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
    {
      id: "password",
      label: "Password",
      type: "password",
      autoComplete: "current-password",
      required: true,
    },
  ];

  return (
    <AuthForm
      fields={fields}
      onSubmit={handleSubmit}
      submitLabel="Sign in"
      isSubmitting={isSubmitting}
    />
  );
}

export default SignInForm;
