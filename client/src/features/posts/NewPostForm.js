import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewPostMutation } from "./postsApiSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from "@fortawesome/free-solid-svg-icons";

const NewPostForm = ({ users }) => {

    const [addNewPost, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewPostMutation();

    const navigate = useNavigate();

    const [text, setText] = useState('');
    const [userId, setUserId] = useState(users[0].id);

    useEffect(() => {
        if (isSuccess) {
            setText('')
            setUserId('')
            navigate('/dash/posts')
        }
    }, [isSuccess, navigate]);

    const onTextChanged = e => setText(e.target.value);
    const onUserIdChanged = e => setUserId(e.target.value);

    const canSave = [text, userId].every(Boolean) && !isLoading;

    const onSavePostClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewPost({ user: userId, text })
        }
    };

    const options = users.map(user => {
        return (
            <option
                key={user.id}
                value={user.id}
            > {user.username}</option >
        )
    });

    const errClass = isError ? "errmsg" : "offscreen";
    const validTextClass = !text ? "form__input--incomplete" : '';

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className="form" onSubmit={onSavePostClicked}>
                <div className="form__title-row">
                    <h2>Nouveau Post</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </div>
                </div>

                <label className="form__label" htmlFor="text">
                    Texte:</label>
                <textarea
                    className={`form__input form__input--text ${validTextClass}`}
                    id="text"
                    name="text"
                    value={text}
                    onChange={onTextChanged}
                />

                <label className="form__label form__checkbox-container" htmlFor="username">
                    Auteur:</label>
                <select
                    id="username"
                    name="username"
                    className="form__select"
                    value={userId}
                    onChange={onUserIdChanged}
                >
                    {options}
                </select>

            </form>
        </>
    )

    return content
}

export default NewPostForm