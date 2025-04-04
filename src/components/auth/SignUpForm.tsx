
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "./AuthForm";
import { signUp } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

export function SignUpForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (formData: Record<string, string>) => {
    try {
      setIsSubmitting(true);
      await signUp({
        email: formData.email,
        password: formData.password,
        name: formData.name
      });
      toast({
        title: "Account created",
        description: "You have successfully created an account.",
      });
      navigate("/profile");
    } catch (error) {
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    {
      id: "name",
      label: "Full name",
      type: "text",
      autoComplete: "name",
      required: true,
    },
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
      autoComplete: "new-password",
      required: true,
    },
  ];

  return (
    <AuthForm
      fields={fields}
      onSubmit={handleSubmit}
      submitLabel="Create account"
      isSubmitting={isSubmitting}
    />
  );
}

export default SignUpForm;
