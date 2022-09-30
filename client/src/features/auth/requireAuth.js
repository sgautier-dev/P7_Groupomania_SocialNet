import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useParams } from 'react-router-dom';

const RequireAuth = () => {
    const location = useLocation();
    const { isAdmin, userId } = useAuth();
    const { id } = useParams();// to grant access to user own user's page

    const content = (
        (isAdmin || id === userId) ? <Outlet />
            : <Navigate to="/login" state={{ from: location }} replace /> //if not allowed bring back to login, "replace" removes requireAuth from browser history 
    );

    return content;
}

export default RequireAuth;