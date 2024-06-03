import 'tailwindcss/tailwind.css';
import '../../index.css';
import { Tab } from '@headlessui/react'
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import Settings from './settings/Settings';
import axios from 'axios';
import { APP_ENV } from '../../env/config';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const AccountPage = () => {
    const baseUrl = APP_ENV.BASE_URL;
    const { email, token } = useParams<{ email: string, token: string }>();
    const [activeTab, setActiveTab] = useState(0); 
    const [formData] = useState({
        email: email || '',
        token: token || '',
    });

    const ConfirmEmail = async () => {
        await axios.post(`${baseUrl}/api/AccountControllers/ConfirmEmail`,  formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    useEffect(() => {
        if (email && token) {
            ConfirmEmail();
        }
    }, [email, token]);

    return (
        <>
            <div className="bg-gray-100">
                <div className="container mx-auto p-8 flex relative max-w-4xl px-2 sm:px-2 lg:px-2 flex-col lg:flex-row justify-between">
                    <div className="sm:mx-auto sm:w-full">
                        <div className="w-full ">
                            <Tab.Group
                            selectedIndex={activeTab} 
                            onChange={setActiveTab}
                            >
                                <Tab.List className="flex space-x-1 rounded-md bg-gray-500/20 p-1"
                                    style={{ backgroundColor: '#303A47' }} >
                                    <Tab
                                        className={({ selected }) =>
                                            classNames(
                                                'w-full rounded-md py-2.5 text-sm font-medium leading-5',
                                                'ring-white/60 ring-offset-2 ring-offset-gray-400 focus:outline-none ',
                                                selected
                                                    ? 'bg-white text-gray-700 '
                                                    : 'text-white hover:bg-white/[0.12] hover:text-white'
                                            )
                                        }
                                    >Settings
                                    </Tab>
                                    <Tab
                                        className={({ selected }) =>
                                            classNames(
                                                'w-full rounded-md py-2.5 text-sm font-medium leading-5',
                                                'ring-white/60 ring-offset-2 ring-offset-gray-400 focus:outline-none ',
                                                selected
                                                    ? 'bg-white text-gray-700 '
                                                    : 'text-white hover:bg-white/[0.12] hover:text-white'
                                            )
                                        }
                                    >Settings
                                    </Tab>

                                </Tab.List>

                                <Tab.Panels className="mt-4">
                                    <Tab.Panel>
                                        <Settings></Settings>
                                    </Tab.Panel>
                                </Tab.Panels>
                            </Tab.Group>
                        </div>
                    </div >
                </div >
            </div >
        </>
    );
}

export default AccountPage;