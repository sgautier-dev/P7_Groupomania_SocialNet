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

    const onNewPostClicked = () => navigate('/dash/posts/new');
    const onNewUserClicked = () => navigate('/dash/users/new');
    const onPostsClicked = () => navigate('/dash/posts');
    const onUsersClicked = () => navigate('/dash/users');
    const onUserClicked = () => navigate(`/dash/users/${userId}`);


    //showing dash class if we are on dash posts or users path
    let dashClass = null
    if (!DASH_REGEX.test(pathname) && !POSTS_REGEX.test(pathname) && !USERS_REGEX.test(pathname)) {
        dashClass = "dash-header__container--small"
    };

    let newPostButton = null
    if (POSTS_REGEX.test(pathname)) {
        newPostButton = (
            <button
                className="icon-button"
                title="New Post"
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
                title="New User"
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
                    title="Users"
                    onClick={onUsersClicked}
                >
                    <FontAwesomeIcon icon={faUserGear} />
                </button>
            )
        }
    } else {
        console.log(pathname)
        if (!pathname.includes('/users')) {
            userButton = (
                <button
                    className="icon-button"
                    title="Users"
                    onClick={onUserClicked}
                >
                    <FontAwesomeIcon icon={faUserGear} />
                </button>
            )
        }
    }

    let postsButton = null
    if (!POSTS_REGEX.test(pathname) && pathname.includes('/dash')) {
        postsButton = (
            <button
                className="icon-button"
                title="Posts"
                onClick={onPostsClicked}
            >
                <FontAwesomeIcon icon={faRectangleList} />
            </button>
        )
    }

    const logoutButton = (
        <button
            className="icon-button"
            title="Logout"
            onClick={sendLogout}
        >
            <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
    );

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