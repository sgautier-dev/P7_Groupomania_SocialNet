
import { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useLoginMutation } from './authApiSlice';

import usePersist from '../../hooks/usePersist';

const Login = () => {
  const userRef = useRef();//to set focus
  const errRef = useRef();//to set focus
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [persist, setPersist] = usePersist();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  //setting focus on email field when component loads
  useEffect(() => {
    userRef.current.focus();
  }, []);

  //emptying error message on email or pass change
  useEffect(() => {
    setErrMsg('');
  }, [email, password]);


  const handleSubmit = async (e) => {
    e.preventDefault();//to prevent page reloading
    try {
      const { accessToken } = await login({ email, password }).unwrap();//using unwrap as we are in a try/catch to catch errors
      dispatch(setCredentials({ accessToken }));
      setEmail('');
      setPassword('');
      navigate('/dash');
    } catch (err) {
      if (!err.status) {
        setErrMsg('No Server Response');
      } else if (err.status === 400) {
        setErrMsg('Missing Email or Password');
      } else if (err.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg(err.data?.message);
      }
      errRef.current.focus();//setting focus on error message
    }
  }

  const handleUserInput = (e) => setEmail(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);
  const handleToggle = () => setPersist(prev => !prev);

  const errClass = errMsg ? "errmsg" : "offscreen";

  if (isLoading) return <p>En cours de chargement...</p>

  const content = (
    <section className="public">
      <header>
        <h1>Login Employé</h1>
      </header>
      <main className="login">
        <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>

        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            className="form__input"
            type="text"
            id="email"
            ref={userRef}
            value={email}
            onChange={handleUserInput}
            autoComplete="off"
            required
          />

          <label htmlFor="password">Mot de passe:</label>
          <input
            className="form__input"
            type="password"
            id="password"
            onChange={handlePwdInput}
            value={password}
            required
          />
          <button className="form__submit-button">Valider</button>

          <label htmlFor="persist" className="form__persist">
            <input
              type="checkbox"
              className="form__checkbox"
              id="persist"
              onChange={handleToggle}
              checked={persist}
            />
            Faire confiance à cet appareil
          </label>
        </form>
      </main>
      <footer>
        <Link to="/">Retour à l'accueil</Link>
      </footer>
    </section>
  )

  return content
}
export default Login;