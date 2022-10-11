import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useDeletePostMutation } from "./postsApiSlice";
import { useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { selectPostById } from './postsApiSlice';
import useAuth from "../../hooks/useAuth";

import LikeButton from "./LikeButton";
import TimeAgo from './TimeAgo';
import ReadMore from './ReadMore';

const Post = ({ postId }) => {

    const post = useSelector(state => selectPostById(state, postId));

    const navigate = useNavigate();

    const { isAdmin, username } = useAuth();
    let isAuthor;
    username === post?.username ? isAuthor = true : isAuthor = false;

    const [deletePost, {
        isError: isDelError,
        error: delerror
    }] = useDeletePostMutation();


    if (post) {

        const handleEdit = () => navigate(`/dash/posts/${postId}`);

        const onDeletePostClicked = async () => {
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
                title="Supprimer"
                onClick={onDeletePostClicked}
            >
                <FontAwesomeIcon icon={faTrashCan} />
            </button>)
        };

        const image = post.imageUrl ? (<img
            src={post.imageUrl}
            alt='post'></img>) : null;

        const errClass = (isDelError) ? "errmsg" : "offscreen";
        const errContent = (delerror?.data?.message) ?? '';

        return (
            <article>
                <p className={errClass}>{errContent}</p>
                <ReadMore text={post.text} />
                {image}
                <p className="postCredit">
                    {post.username} <TimeAgo timestamp={post.createdAt} />
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