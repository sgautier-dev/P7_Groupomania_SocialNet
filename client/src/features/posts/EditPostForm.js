import { useState, useEffect } from "react";
import { useUpdatePostMutation, useDeletePostMutation } from "./postsApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const EditPostForm = ({ post, users }) => {

    const [updatePost, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdatePostMutation();

    const [deletePost, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeletePostMutation();

    const navigate = useNavigate();

    const [text, setText] = useState(post.text);
    const [userId, setUserId] = useState(post.user);

    useEffect(() => {

        if (isSuccess || isDelSuccess) {
            setText('')
            setUserId('')
            navigate('/dash/posts')
        }

    }, [isSuccess, isDelSuccess, navigate]);

    const onTextChanged = e => setText(e.target.value);
    const onUserIdChanged = e => setUserId(e.target.value);

    const canSave = [text, userId].every(Boolean) && !isLoading

    const onSavePostClicked = async (e) => {
        if (canSave) {
            await updatePost({ id: post.id, user: userId, text })
        }
    }

    const onDeletePostClicked = async () => {
        await deletePost({ id: post.id })
    }

    const created = new Date(post.createdAt).toLocaleString('local', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
    const updated = new Date(post.updatedAt).toLocaleString('local', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });

    const options = users.map(user => {
        return (
            <option
                key={user.id}
                value={user.id}

            > {user.username}</option >
        )
    });

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen";
    const validTextClass = !text ? "form__input--incomplete" : '';

    const errContent = (error?.data?.message || delerror?.data?.message) ?? '';

    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Modifier Post #{post.id}</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSavePostClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                            className="icon-button"
                            title="Delete"
                            onClick={onDeletePostClicked}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                </div>

                <label className="form__label" htmlFor="post-text">
                    Text:</label>
                <textarea
                    className={`form__input form__input--text ${validTextClass}`}
                    id="post-text"
                    name="text"
                    value={text}
                    onChange={onTextChanged}
                />
                <div className="form__row">
                    <div className="form__divider">
                        <label className="form__label form__checkbox-container" htmlFor="post-username">
                            AUTEUR:</label>
                        <select
                            id="post-username"
                            name="username"
                            className="form__select"
                            value={userId}
                            onChange={onUserIdChanged}
                        >
                            {options}
                        </select>
                    </div>
                    <div className="form__divider">
                        <p className="form__created">Created:<br />{created}</p>
                        <p className="form__updated">Updated:<br />{updated}</p>
                    </div>
                </div>
            </form>
        </>
    )

    return content
}

export default EditPostForm