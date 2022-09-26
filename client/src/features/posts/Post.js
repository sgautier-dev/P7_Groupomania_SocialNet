import { useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faThumbsUp, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useDeletePostMutation } from "./postsApiSlice";
import { useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { selectPostById } from './postsApiSlice';
import useAuth from "../../hooks/useAuth";

const Post = ({ postId }) => {

    const post = useSelector(state => selectPostById(state, postId))

    const navigate = useNavigate()

    const { isAdmin, username } = useAuth();
    let isAuthor;
    username === post.username ? isAuthor = true : isAuthor = false;

    const [deletePost, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeletePostMutation();

    useEffect(() => {

        if (isDelSuccess) {
            navigate('/dash/posts')
        }

    }, [ isDelSuccess, navigate]);

    if (post) {
        // const created = new Date(post.createdAt).toLocaleString('local', { day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric' })

        const updated = new Date(post.updatedAt).toLocaleString('local', { day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric' })

        const handleEdit = () => navigate(`/dash/posts/${postId}`);
        const handleLike = () => console.log('one like click');
        const onDeletePostClicked = async () => {
            await deletePost({ id: post.id })
        }

        let deleteButton = null;
        let modifyButton = null;
        if (isAdmin || isAuthor) {
            deleteButton = (<button
                className="icon-button"
                onClick={handleEdit}
            >
                <FontAwesomeIcon icon={faPenToSquare} />
            </button>)
            modifyButton = (<button
                className="icon-button"
                title="Delete"
                onClick={onDeletePostClicked}
            >
                <FontAwesomeIcon icon={faTrashCan} />
            </button>)
        };

        const errClass = (isDelError) ? "errmsg" : "offscreen";
        const errContent = delerror?.data?.message ?? '';

        return (
            <article>
                <p className={errClass}>{errContent}</p>
                <p className="excerpt">{post.text.substring(0, 75)}...</p>
                <p className="postCredit">
                    {post.username}. Le {updated}
                </p>
                <button
                    className="icon-button"
                    onClick={handleLike}
                >
                    <FontAwesomeIcon icon={faThumbsUp} />
                </button>
                {modifyButton}
                {deleteButton}
            </article>
        )

    } else return null
}
export default Post