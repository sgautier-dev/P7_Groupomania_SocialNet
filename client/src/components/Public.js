import { Link } from 'react-router-dom';
import logo from '../img/icon-left-font-monochrome-white.svg';

const Public = () => {
    const content = (
        <section className="public">
            <header>
                <h1>Bienvenue sur <span className="nowrap">GroupoNet!</span></h1>
            </header>
            <main className="public__main">
                <div className="public-logo__container">
                    <Link to="/login">
                        <img
                            className="public__logo"
                            src={logo}
                            alt="Grouponet Connection"
                        />
                    </Link>
                </div>
            </main>
            <footer>
                <p>Le réseau social d'entreprise de Groupomania.</p>
            </footer>
        </section>

    );
    return content;
};
export default Public;
