import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFilePen,
    faUserGear,
    faUserPlus,
    faRightFromBracket,
    faRectangleList
} from "@fortawesome/free-solid-svg-icons";
import PuffLoader from 'react-spinners/PuffLoader';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useSendLogoutMutation } from '../features/auth/authApiSlice';
import useAuth from '../hooks/useAuth';
import logo from '../img/icon-left-font-monochrome-white.svg';

const DASH_REGEX = /^\/dash(\/)?$/;
const POSTS_REGEX = /^\/dash\/posts(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

const DashHeader = () => {

    const { isAdmin, userId } = useAuth();

    const navigate = useNavigate();
    const { pathname } = useLocation();

    const [sendLogout, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation();

    useEffect(() => {
        if (isSuccess) navigate('/')
    }, [isSuccess, navigate]);

    const onNewPostClicked = () => navigate('/dash/posts');
    const onNewUserClicked = () => navigate('/dash/users/new');
    const onPostsClicked = () => navigate('/dash');
    const onUsersClicked = () => navigate('/dash/users');
    const onUserClicked = () => navigate(`/dash/users/${userId}`);


    //showing dash class small if we are on dash posts or users path
    let dashClass = null
    // if (!DASH_REGEX.test(pathname) && !POSTS_REGEX.test(pathname) && !USERS_REGEX.test(pathname)) {
    //     dashClass = "dash-header__container--small"
    // };

    let newPostButton = null
    if (DASH_REGEX.test(pathname)) {
        newPostButton = (
            <button
                className="icon-button"
                title="Nouveau Message"
                onClick={onNewPostClicked}
            >
                <FontAwesomeIcon icon={faFilePen} />
            </button>
        )
    }

    let newUserButton = null
    if (USERS_REGEX.test(pathname)) {
        newUserButton = (
            <button
                className="icon-button"
                title="Nouvel Utilisateur"
                onClick={onNewUserClicked}
            >
                <FontAwesomeIcon icon={faUserPlus} />
            </button>
        )
    }

    let userButton = null
    if (isAdmin) {
        if (!USERS_REGEX.test(pathname) && pathname.includes('/dash')) {
            userButton = (
                <button
                    className="icon-button"
                    title="Utilisateurs"
                    onClick={onUsersClicked}
                >
                    <FontAwesomeIcon icon={faUserGear} />
                </button>
            )
        }
    } else {
        if (!pathname.includes('/users')) {
            userButton = (
                <button
                    className="icon-button"
                    title="Compte Utilisateur"
                    onClick={onUserClicked}
                >
                    <FontAwesomeIcon icon={faUserGear} />
                </button>
            )
        }
    }

    let postsButton = null
    if (!DASH_REGEX.test(pathname) && pathname.includes('/dash')) {
        postsButton = (
            <button
                className="icon-button"
                title="Fil d'actu"
                onClick={onPostsClicked}
            >
                <FontAwesomeIcon icon={faRectangleList} />
            </button>
        )
    }

    const logoutButton = (
        <button
            className="icon-button"
            title="Se déconnecter"
            onClick={sendLogout}
        >
            <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
    );
    
    //scroll to the top of the page on logo click
    const handleLogoClick = () => {
        window.scrollTo(0, 0);
    };

    const errClass = isError ? "errmsg" : "offscreen";

    let buttonContent;
    if (isLoading) {
        buttonContent = <PuffLoader color={"#FFF"} />
    } else {
        buttonContent = (
            <>
                {newPostButton}
                {newUserButton}
                {postsButton}
                {userButton}
                {logoutButton}
            </>
        )
    };

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <header className="dash-header">
                <div className={`dash-header__container ${dashClass}`}>
                    <Link to="/dash">

                        <img
                            className="logo"
                            src={logo}
                            alt="groupomania logo"
                            onClick={handleLogoClick}
                        />
                    </Link>
                    <nav className="dash-header__nav">
                        {buttonContent}
                    </nav>
                </div>
            </header>
        </>
    );

    return content;
};

export default DashHeader;