import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewPostMutation } from "./postsApiSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";

const NewPostForm = ({ users }) => {

    const [addNewPost, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewPostMutation();

    const navigate = useNavigate();

    const { isAdmin, username, userId } = useAuth();

    const [text, setText] = useState('');
    const [userID, setUserId] = useState(userId);
    const [file, setFile] = useState(null);

    useEffect(() => {
        if (isSuccess) {
            setText('')
            setUserId('')
            navigate('/dash')
        }
    }, [isSuccess, navigate]);

    const onTextChanged = e => setText(e.target.value);
    const onUserIdChanged = e => setUserId(e.target.value);
    const onFileChanged = e => setFile(e.target.files[0]);

    const canSave = [text, userID].every(Boolean) && !isLoading;

    const onSavePostClicked = async (e) => {
        e.preventDefault()

        const data = new FormData();//to send multipart/form-data
        data.append('user', userID);
        data.append('text', text);
        data.append('image', file);

        if (canSave) {
            await addNewPost(data)
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

    let ownerSelect = (<div className="form__divider"><label className="form__label">
        AUTEUR:</label><p>{username}</p></div>);
    if (isAdmin) {
        ownerSelect = (<div className="form__divider"><label className="form__label form__checkbox-container" htmlFor="username">
            AUTEUR:</label>
            <select
                id="username"
                name="username"
                className="form__select"
                value={userID}
                onChange={onUserIdChanged}
            >
                {options}
            </select></div>)
    }

    const errClass = isError ? "errmsg" : "offscreen";
    const validTextClass = !text ? "form__input--incomplete" : '';

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className="form" encType="multipart/form-data" onSubmit={onSavePostClicked}>
                <div className="form__title-row">
                    <h2>Nouveau Message</h2>

                </div>

                <label className="form__label" htmlFor="text">
                    TEXTE:</label>
                <textarea
                    className={`form__input form__input--text ${validTextClass}`}
                    id="text"
                    name="text"
                    value={text}
                    onChange={onTextChanged}
                />
                <label className="form__label" htmlFor="image">
                    IMAGE: <span className="post__info">--Formats .jpeg .jpg et .png, 3MB max--</span></label>
                <input
                    className="form__input"
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={onFileChanged}
                />
                {ownerSelect}

                <div className="form__action-buttons">
                    <button
                        className="icon-button"
                        title="Sauvegarder"
                        disabled={!canSave}
                    >
                        <FontAwesomeIcon icon={faSave} />
                    </button>
                </div>

            </form>
        </>
    )

    return content
}

export default NewPostForm