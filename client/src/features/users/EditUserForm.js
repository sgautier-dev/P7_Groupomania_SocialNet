import { useState, useEffect } from "react";
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const USER_REGEX = /^[a-zA-Zàâéèëêïîôùüç'\s-]{3,20}$/;
const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const EditUserForm = ({ user }) => {

    const [updateUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUserMutation();

    const [deleteUser, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteUserMutation();

    const navigate = useNavigate();
    const { isAdmin } = useAuth();

    const [username, setUsername] = useState(user.username);
    const [validUsername, setValidUsername] = useState(false);
    const [email, setEmail] = useState(user.email);
    const [validEmail, setValidEmail] = useState(false);
    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [adminRole, setAdminRole] = useState(user.adminRole);
    const [active, setActive] = useState(user.active);

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username]);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email))
    }, [email]);

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password]);

    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setUsername('')
            setEmail('')
            setPassword('')
            if (isAdmin) {
                navigate('/dash/users')
            } else navigate('/dash')
            
        };

    }, [isSuccess, isDelSuccess, navigate, isAdmin]);

    const onUsernameChanged = e => setUsername(e.target.value);
    const onEmailChanged = e => setEmail(e.target.value);
    const onPasswordChanged = e => setPassword(e.target.value);

    const onAdminRoleChanged = () => setAdminRole(prev => !prev);

    const onActiveChanged = () => setActive(prev => !prev);

    const onSaveUserClicked = async (e) => {
        if (password) {
            await updateUser({ id: user.id, username, email, password, adminRole, active })
        } else {
            await updateUser({ id: user.id, username, email, adminRole, active })
        }
    };

    const onDeleteUserClicked = async () => {
        await deleteUser({ id: user.id })
    };

    let canSave
    if (password) {
        canSave = [validEmail, validUsername, validPassword].every(Boolean) && !isLoading
    } else {
        canSave = [validEmail, validUsername].every(Boolean) && !isLoading
    }

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen";
    const validUserClass = !validUsername ? 'form__input--incomplete' : '';
    const validPwdClass = password && !validPassword ? 'form__input--incomplete' : '';
    const validEmailClass = !validEmail ? 'form__input--incomplete' : '';

    const errContent = (error?.data?.message || delerror?.data?.message) ?? '';


    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Modifier Utilisateur</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSaveUserClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                            className="icon-button"
                            title="Delete"
                            onClick={onDeleteUserClicked}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                </div>
                <label className="form__label" htmlFor="username">
                    Username: <span className="nowrap">[3-20 lettres]</span></label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="off"
                    value={username}
                    onChange={onUsernameChanged}
                />

                <label className="form__label" htmlFor="email">
                    E-mail: <span className="nowrap">[valide email incl. @.-]</span></label>
                <input
                    className={`form__input ${validEmailClass}`}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="off"
                    value={email}
                    onChange={onEmailChanged}
                />

                <label className="form__label" htmlFor="password">
                    Password: <span className="nowrap">[vide = pas de modif]</span> <span className="nowrap">[4-12 chars incl. !@#$%]</span></label>
                <input
                    className={`form__input ${validPwdClass}`}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                />

                <label className="form__label form__checkbox-container" htmlFor="adminRole">
                    ADMIN:
                    <input
                        className="form__checkbox"
                        id="adminRole"
                        name="adminRole"
                        type="checkbox"
                        checked={adminRole}
                        onChange={onAdminRoleChanged}
                    />
                </label>

                <label className="form__label form__checkbox-container" htmlFor="user-active">
                    ACTIVE:
                    <input
                        className="form__checkbox"
                        id="user-active"
                        name="user-active"
                        type="checkbox"
                        checked={active}
                        onChange={onActiveChanged}
                    />
                </label>
            </form>
        </>
    )

    return content
}
export default EditUserForm