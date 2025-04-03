
import React from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  footer?: React.ReactNode;
}

export function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  footer 
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-gray-800 px-6 py-8 shadow-md sm:rounded-lg sm:px-10">
            {children}
          </div>
          
          {footer && (
            <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
