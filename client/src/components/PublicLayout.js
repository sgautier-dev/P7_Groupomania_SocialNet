import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import logo from '../img/icon-left-font-monochrome-white.svg';

const PublicLayout = () => {
    const { pathname } = useLocation();

    let footerLink = null;
    if (pathname === '/signup') {
        footerLink = (
            <p>
                Déjà inscrit?
                <span className="line public__link">
                    <Link to="/login">S'identifier</Link>
                </span>
            </p>
        );
    };
    if (pathname === '/login') {
        footerLink = (
            <p>
                Pas encore inscrit?
                <span className="line public__link">
                    <Link to="/signup">S'inscrire</Link>
                </span>
            </p>
        );
    };

    return (
        <section className="public">
            <header>
                <Link to="/">
                    <img
                        className="logo"
                        src={logo}
                        alt="groupomania logo"
                    />
                </Link>
            </header>
            <main className="public__main">
                <Outlet />
            </main>
            <footer>
                {footerLink}
            </footer>
        </section>
    )
};

export default PublicLayout;