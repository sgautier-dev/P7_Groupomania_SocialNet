import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';// for access control

const Welcome = () => {

    const { username, isAdmin } = useAuth();

    const date = new Date();
    const today = new Intl.DateTimeFormat('local', { dateStyle: 'full', timeStyle: 'long' }).format(date);

    const content = (
        <section className="welcome">

            <p>{today}</p>

            <h1>Bienvenue {username}</h1>

            <p><Link to="/dash/posts">Voir les Posts</Link></p>

            <p><Link to="/dash/posts/new">Ajouter un Post</Link></p>

            {isAdmin && <>
                <p><Link to="/dash/users">Voir les Utilisateurs</Link></p>
                <p><Link to="/dash/users/new">Créer un nouveau compte Utilisateur</Link></p>
            </>}

        </section>
    );

    return content;
};

export default Welcome;