
import { isAuthenticated } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="text-center px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
          <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-5xl">Welcome to Keeper of Keys</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          A secure and elegant authentication service for your applications
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          {authenticated ? (
            <Button
              onClick={() => navigate("/profile")}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-md shadow-sm"
            >
              View Profile
            </Button>
          ) : (
            <>
              <Button
                onClick={() => navigate("/signin")}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-md shadow-sm"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate("/signup")}
                variant="outline"
                className="w-full sm:w-auto px-8 py-3 border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-md"
              >
                Create Account
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
