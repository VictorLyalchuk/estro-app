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
import { IUserEdit } from '../../../interfaces/Auth/IUserEdit';
import { getUserData, refreshToken } from '../../../services/accounts/account-services'; 

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
    const [userEdit, setUserEdit] = useState<IUserEdit>();
    const [formData] = useState({
        email: email || '',
        token: token || '',
    });
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
            component: <Profile userEdit={userEdit} countPage={countPage}/>,
        },
        {
            name: 'Settings',
            current: activeTab === 2,
            component: <Settings />,
        },
        {
            name: 'My Bonuses',
            current: activeTab === 3,
            component: <Settings />,
        },
    ];
      
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


        // if (location.pathname === '/account/orders') {
        //     setActiveTab(0);
        // }
        // if (location.pathname === '/account/profile' || location.pathname === 'account/settings/:email/:token') {
        //     setActiveTab(1);
        // } 
        // if (location.pathname === '/account/settings') {
        //     setActiveTab(2);
        // } 
    }, [location.pathname]);

    useEffect(() => {
        if (email && token) {
            ConfirmEmail();
        }
    }, [email, token]);

    useEffect(() => {
        getCountOrders();
        getOrders();
    }, [user, page]);

    useEffect(() => {
        getUserData(user?.Email ?? 'null')
        .then(data => {
            setUserEdit(data);
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
      }, [user?.Email]);

    const ConfirmEmail = async () => {
        await axios.post(`${baseUrl}/api/AccountControllers/ConfirmEmail`, formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        await refreshToken();
        await getUserData(user?.Email ?? 'null')
        .then(data => {
            setUserEdit(data);
        })
    }

    const getOrders = async () => {
        if (user) {
            const resp = await axios.get<IOrderUser[]>(`${baseUrl}/api/OrderControllers/GetOrderByEmail/${user?.Email}`, {
                params: {page},
              });
            setOrdersUser(resp.data)
        }
    }
    const getCountOrders = async () => {
        if (user) {
            const resp = await axios.get<number>(`${baseUrl}/api/OrderControllers/GetCountOrderByEmail/${user?.Email}`)
            setCountPage(resp.data)
        }
    }
    const handleTabChange = (index: number) => {
        setActiveTab(index);
        if (index === 0) {
            setViewMode('detailed');
            navigate('/account/orders');
        }
        if (index === 1) {
            navigate('/account/profile');
        }
        if (index === 2) {
            navigate('/account/settings');
        }
    };
    

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
