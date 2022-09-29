import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAddNewUserMutation } from "../features/users/usersApiSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const USER_REGEX = /^[A-z][A-Za-zÀ-Ÿà-ÿ-0-9-._\s]{3,23}$/;
const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%&]).{8,24}$/;

const Signup = () => {
    const [addNewUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewUserMutation();

    const userRef = useRef();
    const errRef = useRef();

    const [username, setUsername] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [password, setPassword] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);//focusing on username field on first render

    useEffect(() => {
        setValidName(USER_REGEX.test(username))
    }, [username]);//username validation

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email))
    }, [email]);//email validation

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(password));
        const match = password === matchPwd;
        setValidMatch(match);
    }, [password, matchPwd]);//password and match password validation

    //emptying after successful creation
    useEffect(() => {
        if (isSuccess) {
            setUsername('')
            setEmail('')
            setPassword('')
        }
    }, [isSuccess]);

    const canSave = [validEmail, validName, validPwd].every(Boolean) && !isLoading;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (canSave) {
            console.log({ username, email, password });
            await addNewUser({ username, email, password });
        }
    }

    return (
        <>
            {isSuccess ? (
                <>
                    <h1>Inscription réussie!</h1>
                    <p className="line public__link">
                        <Link to="/login">S'identifier</Link>
                    </p>
                </>
            ) : (
                <>
                    <p ref={errRef} className={isError ? "errmsg" : "offscreen"} aria-live="assertive">{error?.data?.message}</p>
                    <form className="form" onSubmit={handleSubmit}>
                        <h1>Inscription Employé</h1>
                        <label htmlFor="username">
                            Nom d'utilisateur:
                            <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validName || !username ? "hide" : "invalid"} />
                        </label>
                        <input
                            className="form__input"
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />
                        <p id="uidnote" className={userFocus && username && !validName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 à 24 caractères.<br />
                            Doit commencer par une lettre.<br />
                            Lettres, chiffres, traits de soulignement, traits d'union autorisés.
                        </p>

                        <label htmlFor="email">
                            E-mail:
                            <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                        </label>
                        <input
                            className="form__input"
                            type="email"
                            id="email"
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                            aria-invalid={validEmail ? "false" : "true"}
                            aria-describedby="enote"
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                        />
                        <p id="enote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Doit être un email valide.
                        </p>

                        <label htmlFor="password">
                            Mot de passe:
                            <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPwd || !password ? "hide" : "invalid"} />
                        </label>
                        <input
                            className="form__input"
                            type="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
                        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 à 24 caractères.<br />
                            Doit inclure des lettres majuscules et minuscules, au moins un chiffre et un caractère spécial.<br />
                            Caractères spéciaux autorisés: <span aria-label="point d'exclamation">!</span> <span aria-label="arobase">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar">$</span> <span aria-label="pourcentage">%</span>
                            <span aria-label="esperluette">&</span>
                        </p>

                        <label htmlFor="confirm_pwd">
                            Confirmez le mot de passe:
                            <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                        </label>
                        <input
                            className="form__input"
                            type="password"
                            id="confirm_pwd"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Doit correspondre au premier champ de saisie du mot de passe.
                        </p>

                        <button className="form__submit-button"
                            disabled={!validName || !validPwd || !validMatch ? true : false}>S'inscrire</button><br />
                    </form>
            
                </>
            )}
        </>
    )
};

export default Signup;