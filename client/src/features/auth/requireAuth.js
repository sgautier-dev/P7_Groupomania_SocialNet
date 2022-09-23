import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = () => {
    const location = useLocation();
    const { adminRole } = useAuth();

    const content = (
        adminRole ? <Outlet />
        : <Navigate to="/login" state={{ from: location }} replace /> //if not allowed bring back to login, "replace" removes requireAuth from browser history 
    );

    return content;
}

export default RequireAuth;