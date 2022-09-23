import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = () => {
    const location = useLocation();
    const { isAdmin } = useAuth();

    const content = (
        isAdmin ? <Outlet />
        : <Navigate to="/login" state={{ from: location }} replace /> //if not allowed bring back to login, "replace" removes requireAuth from browser history 
    );

    return content;
}

export default RequireAuth;