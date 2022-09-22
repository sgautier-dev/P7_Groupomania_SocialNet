import React from 'react';
import { Link } from 'react-router-dom';

const Public = () => {
    const content = (
        <section className="public">
            <header>
                <h1>Bienvenue sur <span className="nowrap">GroupoNet!</span></h1>
            </header>
            <main className="public__main">
                <Link to="/login">Connection</Link>
            </main>
            <footer>
                <p>Le réseau social d'entreprise de Groupomania.</p>
            </footer>
        </section>

    )
    return content
};
export default Public;
