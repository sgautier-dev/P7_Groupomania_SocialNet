import { Outlet } from 'reac-router-dom';
import DashHeader from './DashHeader';

const DashLayout = () => {
    return (
        <>
            <DashHeader />
            <div className='dash-container'>
                <Outlet />
            </div>
        </>
    )
};

export default DashLayout;
