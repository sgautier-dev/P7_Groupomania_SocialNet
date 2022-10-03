import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";
import { useAddLikeMutation } from "./postsApiSlice";

const LikeButton = ({ post }) => {
    const { userId } = useAuth();
    let postIsLiked = post?.likes.includes(userId);
    let numLikes = post?.likes.length;

    const [updatePostLike] = useAddLikeMutation();

    const [like, setLike] = useState(postIsLiked);

    const handleLike = () => setLike(prev => !prev);

    const onLikeClicked = async () => {
        handleLike();

        let newLikes = [...post.likes];

        if (!like && !postIsLiked) {
            newLikes.push(userId);
        } else {
            newLikes = newLikes.filter(user => user !== userId);
        }

        await updatePostLike({ ...post, likes: newLikes });
    }

    const likeClass = (like) ? "liked" : "unliked";

    return (
        <div>
            <button
                className="icon-button"
                onClick={onLikeClicked}
            >
                <FontAwesomeIcon icon={faThumbsUp} className={likeClass} />
            </button> <span className="likes">{numLikes}</span>
        </div>
    )
}
export default LikeButton