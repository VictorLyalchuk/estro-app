import 'tailwindcss/tailwind.css';
import '../../../index.css';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";
import { IAuthReducerState } from '../../../store/accounts/AuthReducer';
import { IUserProfile } from '../../../interfaces/Auth/IUserProfile';
import { getUserData } from '../../../services/accounts/account-services';
import TabsOrdersComponent from './TabsOrdersComponent';
import Profile from './profile/Profile';
import Settings from './settings/Settings';
import Bonuses from './bonuses/Bonuses';
import CompactOrders from './orders/CompactOrders';
import Orders from './orders/Orders';
import { getProfileOrders, getUserOrders } from '../../../services/order/order-services';

const UserPanelPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useSelector((redux: any) => redux.auth as IAuthReducerState);
    const [orders, setOrdersUser] = useState<IOrderUser[]>([]);
    const [viewMode, setViewMode] = useState('detailed');
    const [activeTab, setActiveTab] = useState(0);
    const [page, setPage] = useState(1);
    const [countPage, setCountPage] = useState(0);
    const [userProfile, setUserProfile] = useState<IUserProfile>();

    const handleViewModeChange = () => {
        setViewMode(prevMode => (prevMode === 'detailed' ? 'compact' : 'detailed'));
    };
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };
    const tabs = [
        {
            name: 'Orders',
            current: activeTab === 0,
            component: viewMode === 'detailed' ? <Orders orders={orders} onViewModeChange={handleViewModeChange} page={page} countPage={countPage} onPageChange={handlePageChange} />
                : <CompactOrders orders={orders} onViewModeChange={handleViewModeChange} page={page} countPage={countPage} onPageChange={handlePageChange} />,
            count: countPage.toString(),
        },
        {
            name: 'Profile',
            current: activeTab === 1,
            component: <Profile userProfile={userProfile} countPage={countPage} />,
        },
        {
            name: 'Settings',
            current: activeTab === 2,
            component: <Settings userProfile={userProfile} />,
        },
        {
            name: 'My Bonuses',
            current: activeTab === 3,
            component: <Bonuses userProfile={userProfile} />,
        },
    ];
    const handleTabChange = (index: number) => {
        setActiveTab(index);
        const routes = ['/account/orders', '/account/profile', '/account/settings', '/account/bonuses'];
        navigate(routes[index]);
    };

    useEffect(() => {
        if (location.pathname.startsWith('/account/orders')) {
            setActiveTab(0);
        }
        else if (location.pathname.startsWith('/account/profile')) {
            setActiveTab(1);
        }
        else if (location.pathname.startsWith('/account/settings')) {
            setActiveTab(2);
        }
        else if (location.pathname.startsWith('/account/bonuses')) {
            setActiveTab(3);
        }
    }, [location.pathname]);

    useEffect(() => {
        if (user) {
            getUserOrders(user.Email)
                .then(data => setCountPage(data))
                .catch(error => console.error('Error fetching count order data:', error));
                
            getProfileOrders(user.Email, page)
                .then(data => setOrdersUser(data))
                .catch(error => console.error('Error fetching user data:', error));

            getUserData(user.Email)
                .then(data => setUserProfile(data))
                .catch(error => console.error('Error fetching user data:', error));
        }
    }, [user, page]);

    return (
        <>
            <div className="bg-gray-100">
                <div className="container mx-auto p-8 flex relative max-w-7xl px-2 sm:px-2 lg:px-2 flex-col lg:flex-row justify-between">
                    <div className="sm:mx-auto sm:w-full">
                        <div className="w-full ">
                            <TabsOrdersComponent tabs={tabs} onTabChange={handleTabChange} />
                            <div className="mt-4">
                                {tabs.find(tab => tab.current)?.component}
                            </div>
                        </div>
                    </div >
                </div >
            </div >
        </>
    )
}

export default UserPanelPage;
