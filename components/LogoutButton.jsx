"use client";

import { signOut } from "next-auth/react";
import { LogOut } from 'lucide-react';

export default function LogoutButton({ className = "" }) {
  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
      <div className="tooltip tooltip-right" data-tip="Iesi din cont">
        <button type="button" className={`p-4 bg-base-300 hover:bg-error hover:text-error-content ${className}`} onClick={handleLogout}>
          <LogOut />
        </button>
      </div>
  );
}
