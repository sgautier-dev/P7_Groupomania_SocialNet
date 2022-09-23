import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { selectUserById } from './usersApiSlice';


const User = ({ userId }) => {
    const user = useSelector(state => selectUserById(state, userId));

    const navigate = useNavigate();

    if (user) {
        const handleEdit = () => navigate(`/dash/users/${userId}`);
        const cellStatus = user.active ? '' : 'table__cell--inactive';

        return (
            <tr className="table__row">
                <td className={`table__cell ${cellStatus} user__username`}>{user.username}</td>
                <td className={`table__cell ${cellStatus} user__roles`}>{user.adminRole ? 'Admin' : 'Employé'}</td>
                <td className={`table__cell ${cellStatus} user__edit`}>
                    <button
                        className="icon-button table__button"
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        )
    } else return null

    
};

export default User;