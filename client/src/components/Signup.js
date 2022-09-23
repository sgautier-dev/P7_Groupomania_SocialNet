import { Link } from 'react-router-dom';
import NewUserForm from '../features/users/NewUserForm';

const Signup = () => {
    const content = (
        <section className="public">
            <header>
                <h1>Inscription</h1>
            </header>
            <main className="public__main">
                <NewUserForm />
            </main>
            <footer>
                <Link to="/">Retour à l'accueil</Link>
            </footer>
        </section>

    );
    return content;
};
export default Signup;