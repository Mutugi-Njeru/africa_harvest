import { Navigate, useLocation } from "react-router-dom";
import { hasRolePermission } from "../utils/Utils";

export const ProtectedRoute = ({ children, allowedRole }) => {
  const location = useLocation();
  const userRoles = JSON.parse(localStorage.getItem("roles")) || [];
  const isSuperAdmin = hasRolePermission(userRoles, allowedRole);

  if (!isSuperAdmin) {
    return <Navigate to="/overview" state={{ from: location }} replace />;
  }

  return children;
};

export const ProtectedAdminRoute = ({ children }) => {
  const location = useLocation();
  const userRoles = JSON.parse(localStorage.getItem("roles")) || [];
  const isSuperAdmin = hasRolePermission(userRoles, "SUPER_ADMIN");
  const isAdmin = hasRolePermission(userRoles, "ADMIN");

  if (!(isSuperAdmin || isAdmin)) {
    return <Navigate to="/overview" state={{ from: location }} replace />;
  }

  return children;
};
