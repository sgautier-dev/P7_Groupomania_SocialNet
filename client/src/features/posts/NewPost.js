import { useSelector } from 'react-redux';
import { selectAllUsers } from '../users/usersApiSlice';
import NewPostForm from './NewPostForm.js';
import PuffLoader from 'react-spinners/PuffLoader';

const NewPost = () => {
    const users = useSelector(selectAllUsers);

    if (!users?.length) return <PuffLoader color={"#FFF"} />;

    const content = <NewPostForm users={users} />;

    return content;
}
export default NewPost;