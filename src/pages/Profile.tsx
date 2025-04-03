
import { UserProfile } from "@/components/auth/UserProfile";
import { isAuthenticated } from "@/lib/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/signin");
    }
  }, [navigate]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Your Account</h1>
      <UserProfile />
    </div>
  );
}
