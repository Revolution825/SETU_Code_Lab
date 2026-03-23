import { Navigate } from "react-router-dom";
import { useAuth } from "./authContext";

type Role = "student" | "lecturer";

interface ProtectedRouteProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

export function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const user = useAuth();

  if (!user) return <Navigate to="/" />;
  if (!allowedRoles.includes(user?.user?.role as Role))
    return <Navigate to="/" />;

  return children;
}
