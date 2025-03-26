import { Navigate, useLocation } from "react-router-dom";
import { hasRolePermission } from "../utils/Utils";

const ProtectedRoute = ({ children, allowedRole }) => {
  const location = useLocation();
  const userRoles = JSON.parse(localStorage.getItem("roles")) || [];
  const isSuperAdmin = hasRolePermission(userRoles, "SUPER_ADMIN");

  if (!isSuperAdmin) {
    return <Navigate to="/overview" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
