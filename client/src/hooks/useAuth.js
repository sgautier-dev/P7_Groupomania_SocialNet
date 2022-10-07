import { useSelector } from 'react-redux';
import { selectCurrentToken } from "../features/auth/authSlice";
import jwtDecode from 'jwt-decode';//to decode token

const useAuth = () => {
    const token = useSelector(selectCurrentToken);
    let isAdmin = false;
    let status = "Utilisateur";

    if (token) {
        const decoded = jwtDecode(token);
        const { username, adminRole, userId } = decoded.UserInfo;

        if (adminRole) {
            isAdmin = true;
            status = "Admin";
        }

        return { userId, username, isAdmin, status };
    }

    return { userId: '', username: '', isAdmin, status };
}
export default useAuth;