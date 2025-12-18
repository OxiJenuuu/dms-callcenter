"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton({ className = "" }) {
  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <button type="button" className={`btn btn-ghost ${className}`} onClick={handleLogout}>
      Logout
    </button>
  );
}
