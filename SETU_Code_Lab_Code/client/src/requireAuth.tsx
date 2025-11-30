import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface RequireAuthProps {
  children: ReactNode;
}

export default function RequireAuth({children}: Readonly<RequireAuthProps>) {
    const token = localStorage.getItem("token");

    if(!token) return <Navigate to="/" replace />;

    return <>{children}</>;
}