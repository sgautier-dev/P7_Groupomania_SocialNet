import { useSelector } from 'react-redux';
import { selectAllUsers } from '../users/usersApiSlice';
import NewPostForm from './NewPostForm.js';

const NewPost = () => {
    const users = useSelector(selectAllUsers);
    
    if (!users?.length) return <p>Non disponible actuellement</p>

    const content = <NewPostForm users={users} />

    return content;
}
export default NewPost;