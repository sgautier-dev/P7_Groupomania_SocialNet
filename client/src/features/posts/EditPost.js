import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectPostById } from './postsApiSlice';
import { selectAllUsers } from '../users/usersApiSlice';
import EditPostForm from './EditPostForm';

const EditPost = () => {
    const { id } = useParams();

    const post = useSelector(state => selectPostById(state, id));
    const users = useSelector(selectAllUsers);

    const content = post && users ? <EditPostForm post={post} users={users} /> : <p>En cours de chargement...</p>;

    return content;
}
export default EditPost;