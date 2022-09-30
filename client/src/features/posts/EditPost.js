import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectPostById } from './postsApiSlice';
import { selectAllUsers } from '../users/usersApiSlice';
import EditPostForm from './EditPostForm';
import useAuth from '../../hooks/useAuth'
import PuffLoader from 'react-spinners/PuffLoader';

const EditPost = () => {
    const { id } = useParams();
    const { username, isAdmin } = useAuth()

    const post = useSelector(state => selectPostById(state, id));
    const users = useSelector(selectAllUsers);

    if (!post || !users?.length) return <PuffLoader color={"#FFF"} />

    //in case a user might type a postId directly in the pathname
    if (!isAdmin) {
        if (post.username !== username) {
            return <p className="errmsg">Non autorisé</p>
        }
    }

    const content = <EditPostForm post={post} users={users} />;

    return content;
}
export default EditPost;