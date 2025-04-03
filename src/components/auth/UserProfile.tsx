
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser, updateProfile, signOut } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

export function UserProfile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<{ id: string; email: string; name?: string } | null>(null);
  const [name, setName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setName(currentUser.name || "");
    } else {
      navigate("/signin");
    }
  }, [navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsUpdating(true);
      const updatedUser = await updateProfile(user.id, { name });
      setUser(updatedUser);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    navigate("/signin");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Manage your account details</CardDescription>
        </CardHeader>
        <form onSubmit={handleUpdateProfile}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between">
            <Button
              type="submit"
              disabled={isUpdating}
              className="flex w-full sm:w-auto justify-center"
            >
              {isUpdating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleSignOut}
              className="w-full sm:w-auto"
            >
              Sign out
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default UserProfile;
