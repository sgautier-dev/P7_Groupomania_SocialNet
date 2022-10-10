import { useState, useEffect } from "react";
import { useAddNewUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from "@fortawesome/free-solid-svg-icons";

const USER_REGEX = /^[A-z][A-Za-zÀ-Ÿà-ÿ-0-9-._\s]{3,23}$/;
const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
//less strict password Regex than on the public register new user 
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const NewUserForm = () => {

  const [addNewUser, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useAddNewUserMutation();

  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [validUsername, setValidUsername] = useState(false);
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  //const [adminRole, setAdminRole] = useState(false);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username))
  }, [username]);
  
  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email))
  }, [email]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password))
  }, [password]);

  //emptying and navigating after successful creation
  useEffect(() => {
    if (isSuccess) {
      setUsername('')
      setEmail('')
      setPassword('')
      navigate('/dash/users')
    }
  }, [isSuccess, navigate]);

  const onUsernameChanged = e => setUsername(e.target.value);
  const onEmailChanged = e => setEmail(e.target.value);
  const onPasswordChanged = e => setPassword(e.target.value);

  const canSave = [validEmail, validUsername, validPassword].every(Boolean) && !isLoading;

  const onSaveUserClicked = async (e) => {
    e.preventDefault()
    if (canSave) {
      await addNewUser({ username, email, password })
    }
  };

  const errClass = isError ? "errmsg" : "offscreen";
  const validUserClass = !validUsername ? 'form__input--incomplete' : '';
  const validEmailClass = !validEmail ? 'form__input--incomplete' : '';
  const validPwdClass = !validPassword ? 'form__input--incomplete' : '';

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveUserClicked}>
        <div className="form__title-row">
          <h2>Nouvel Utilisateur</h2>
          
        </div>
        <label className="form__label" htmlFor="username">
          Nom d'utilisateur: <span className="nowrap">[3-20 lettres]</span></label>
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
          Mot de passe: <span className="nowrap">[4-12 caracs incl. !@#$%]</span></label>
        <input
          className={`form__input ${validPwdClass}`}
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={onPasswordChanged}
        />
        <br/><br/>
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
  );

  return content;
}
export default NewUserForm;