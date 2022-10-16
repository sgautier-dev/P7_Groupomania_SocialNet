import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from 'react-redux';
import { selectCurrentToken } from "./authSlice";
import PuffLoader from 'react-spinners/PuffLoader';

const PersistLogin = () => {

    const [persist] = usePersist();
    const token = useSelector(selectCurrentToken);
    const effectRan = useRef(false);//to handle React V18 strict mode in development initial double mounting of components

    const [trueSuccess, setTrueSuccess] = useState(false);

    const [refresh, {
        isUninitialized, //refresh not called yet
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation();


    useEffect(() => {

        if (effectRan.current === true || process.env.NODE_ENV !== 'development') { // React 18 Strict Mode (in development), verify refresh token only at second initial mounting

            const verifyRefreshToken = async () => {
                //console.log('verifying refresh token');
                try {
                    //const response = 
                    await refresh();
                    //const { accessToken } = response.data
                    setTrueSuccess(true);//used because refresh isSuccess can be true before credentials are set
                }
                catch (err) {
                    console.error(err);
                }
            }

            if (!token && persist) verifyRefreshToken()//when refreshing page for example token is null
        }

        return () => effectRan.current = true;//setting to true in cleanup func after first mounting

        //removing the unnecessary warning about dependencies
        // eslint-disable-next-line
    }, []);

    let content;
    if (!persist) { // persist: no
        content = <Outlet />
    } else if (isLoading) { //persist: yes, token: no
        content = <PuffLoader color={"#FFF"} />
    } else if (isError) { //persist: yes, token: no
        content = (
            <p className='errmsg'>
                {`${error?.data?.message} - `}
                <Link to="/login">Veuillez vous reconnecter</Link>.
            </p>
        )
    } else if ((isSuccess && trueSuccess) || (token && isUninitialized)) { //persist: yes, token: yes
        content = <Outlet />
    }

    return content;
};

export default PersistLogin;