import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
    const date = new Date();
    const today = new Intl.DateTimeFormat('local', { dateStyle: 'full', timeStyle: 'long' }).format(date);

    const content = (
        <section className="welcome">

            <p>{today}</p>

            <h1>Bienvenue !</h1>

            <p><Link to="/dash/posts">Voir les Posts</Link></p>

            <p><Link to="/dash/users">Voir les Utilisateurs</Link></p>

        </section>
    );

    return content;
};

export default Welcome;