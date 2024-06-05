import 'tailwindcss/tailwind.css';
import '../../../index.css';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import Settings from './settings/Settings';
import axios from 'axios';
import { APP_ENV } from '../../../env/config';
import CompactOrders from './orders/CompactOrders';
import Orders from './orders/Orders';
import { useSelector } from "react-redux";
import { IAuthReducerState } from '../../../store/accounts/AuthReducer';
import TabsOrdersComponent from './TabsOrdersComponent';
import { useLocation } from 'react-router-dom';
import Profile from './profile/Profile';
import { IUserProfile } from '../../../interfaces/Auth/IUserProfile';
import { getUserData, refreshToken } from '../../../services/accounts/account-services'; 
import Bonuses from './bonuses/Bonuses';

const UserPanelPage = () => {
    const baseUrl = APP_ENV.BASE_URL;
    const location = useLocation();
    const navigate = useNavigate();
    const { email, token } = useParams<{ email: string, token: string }>();
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
            component: viewMode === 'detailed' ? <Orders orders={orders} onViewModeChange={handleViewModeChange} page={page} countPage={countPage} onPageChange={handlePageChange}/> 
            : <CompactOrders orders={orders} onViewModeChange={handleViewModeChange} page={page} countPage={countPage} onPageChange={handlePageChange} />,
            count: countPage.toString(), 
        },
        {
            name: 'Profile',
            current: activeTab === 1,
            component: <Profile userProfile={userProfile} countPage={countPage}/>,
        },
        {
            name: 'Settings',
            current: activeTab === 2,
            component: <Settings userProfile={userProfile}/>,
        },
        {
            name: 'My Bonuses',
            current: activeTab === 3,
            component: <Bonuses />,
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
        if (email && token) {
            ConfirmEmail();
        }
    }, [email, token]);

    useEffect(() => {
        if (user) {
            getCountOrders();
            getOrders();
            getUserData(user.Email)
                .then(data => setUserProfile(data))
                .catch(error => console.error('Error fetching user data:', error));
        }
    }, [user, page]);

    const ConfirmEmail = async () => {
        try {
            await axios.post(`${baseUrl}/api/AccountControllers/ConfirmEmail`, { email, token }, {
                headers: { 'Content-Type': 'application/json' }
            });
            await refreshToken();
            if (user) {
                const data = await getUserData(user.Email);
                setUserProfile(data);
            }
        } catch (error) {
            console.error('Error confirming email:', error);
        }
    }

    const getOrders = async () => {
        if (user) {
            try {
                const resp = await axios.get<IOrderUser[]>(`${baseUrl}/api/OrderControllers/GetOrderByEmail/${user.Email}`, { params: { page } });
                setOrdersUser(resp.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        }
    }
    const getCountOrders = async () => {
        if (user) {
            try {
                const resp = await axios.get<number>(`${baseUrl}/api/OrderControllers/GetCountOrderByEmail/${user.Email}`);
                setCountPage(resp.data);
            } catch (error) {
                console.error('Error fetching order count:', error);
            }
        }
    }

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
