import { Link } from 'react-router-dom';
import RegisterUserForm from '../features/users/RegisterUserForm';

const Signup = () => {
    const content = (
        <section className="public">
            <header>
                <h1>Inscription Nouvel Utilisateur</h1>
            </header>
            <main className="public__main">
                <RegisterUserForm />
            </main>
            <footer>
                <Link to="/">Retour à l'accueil</Link>
            </footer>
        </section>

    );
    return content;
};
export default Signup;