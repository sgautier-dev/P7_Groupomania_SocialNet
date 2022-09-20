import { useSelector } from 'react-redux';
import { selectAllUsers } from '../users/usersApiSlice';
import NewPostForm from './NewPostForm.js';

const NewPost = () => {
    const users = useSelector(selectAllUsers);

    const content = users ? <NewPostForm users={users} /> : <p>En cours de chargement...</p>;

    return content;
}
export default NewPost;