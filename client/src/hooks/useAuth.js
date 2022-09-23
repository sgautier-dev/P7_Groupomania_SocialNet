import { useSelector } from 'react-redux';
import { selectCurrentToken } from "../features/auth/authSlice";
import jwtDecode from 'jwt-decode';//to decode token

const useAuth = () => {
    const token = useSelector(selectCurrentToken);
    let isAdmin = false;
    let status = "Employé";

    if (token) {
        const decoded = jwtDecode(token);
        const { username, adminRole } = decoded.UserInfo;

        if (adminRole) {
            isAdmin = true;
            status = "Admin";
        }

        return { username, adminRole, status, isAdmin };
    }

    return { username: '', isAdmin, status };
}
export default useAuth;