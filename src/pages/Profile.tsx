
import { UserProfile } from "@/components/auth/UserProfile";
import { Button } from "@/components/ui/button";
import { isAuthenticated } from "@/lib/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";

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
      
      <div className="mb-8">
        <Button 
          onClick={() => navigate("/dashboard")}
          className="w-full"
        >
          <Shield className="mr-2 h-5 w-5" />
          Go to Port Scanner Dashboard
        </Button>
      </div>
      
      <UserProfile />
    </div>
  );
}
