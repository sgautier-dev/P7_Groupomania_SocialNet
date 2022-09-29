import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useDeletePostMutation } from "./postsApiSlice";
import { useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { selectPostById } from './postsApiSlice';
import useAuth from "../../hooks/useAuth";

import LikeButton from "./LikeButton";

const Post = ({ postId }) => {

    const post = useSelector(state => selectPostById(state, postId))

    const navigate = useNavigate()

    const { isAdmin, username } = useAuth();
    let isAuthor;
    username === post?.username ? isAuthor = true : isAuthor = false;

    const [deletePost, {
        isError: isDelError,
        error: delerror
    }] = useDeletePostMutation();


    if (post) {
        // const created = new Date(post.createdAt).toLocaleString('local', { day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric' })
        const updated = new Date(post.updatedAt).toLocaleString('local', { day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric' });

        const handleEdit = () => navigate(`/dash/posts/${postId}`);
        //const handleLike = () => setLike(prev => !prev);


        const onDeletePostClicked = async () => {
            console.log(post.imageUrl)
            await deletePost({ id: post.id, imageUrl: post.imageUrl });
        };

        let deleteButton = null;
        let modifyButton = null;
        if (isAdmin || isAuthor) {
            modifyButton = (<button
                className="icon-button"
                onClick={handleEdit}
            >
                <FontAwesomeIcon icon={faPenToSquare} />
            </button>)
            deleteButton = (<button
                className="icon-button"
                title="Delete"
                onClick={onDeletePostClicked}
            >
                <FontAwesomeIcon icon={faTrashCan} />
            </button>)
        };

        const image = post.imageUrl ? (<img
            src={post.imageUrl}
            alt='post'></img>) : null;

        const errClass = (isDelError) ? "errmsg" : "offscreen";
        const errContent = ( delerror?.data?.message) ?? '';

        return (
            <article>
                <p className={errClass}>{errContent}</p>
                <p className="excerpt">{post.text}</p>
                {image}
                <p className="postCredit">
                    {post.username} le {updated}
                </p>

                <div className="list__buttons">         
                    <LikeButton post={post} />
                    {modifyButton}
                    {deleteButton}
                </div>
            </article>
        )

    } else return null
}
export default Post