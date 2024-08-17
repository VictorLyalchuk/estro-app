import { Fragment } from 'react'
import { Menu, Popover, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon, } from '@heroicons/react/24/outline'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AuthReducerActionType, IAuthReducerState } from '../../../store/accounts/AuthReducer'
import { APP_ENV } from '../../../env/config'
import { BagReducerActionType } from '../../../store/bag/BagReducer'
import { CardReducerActionType } from '../../../store/bag/CardReducer'
import { FavoritesReducerActionType } from '../../../store/favourites/FavoritesReducer'

const navigation = [
    { name: 'Home', link: '/admin/admin-panel-page', current: false },
    { name: 'Products', link: '/admin/product/product-list', current: false },
    { name: 'Main Categories', link: '/admin/main-category/main-category-list', current: false },
    { name: 'Sub Categories', link: '#', current: false },
    { name: 'Categories', link: '#', current: false },
    { name: 'Users', link: '#', current: false },
    { name: 'Stores', link: '#', current: false },
]
const userNavigation = [
    { name: 'Your Profile', to: '/account/profile' },
    { name: 'Settings', to: '/account/settings' },
    { name: 'Sign out', to: '/', action: 'logout' },
]
export default function AdminHeader() {
    const { t } = useTranslation();
    const baseUrl = APP_ENV.BASE_URL;
    const { user } = useSelector((redux: any) => redux.auth as IAuthReducerState);
    const dispatch = useDispatch();

    const handleLogout = () => {
        localStorage.removeItem("token");
        dispatch({ type: AuthReducerActionType.LOGOUT_USER, });
        dispatch({ type: BagReducerActionType.DELETE_BAG_ALL, });
        dispatch({ type: CardReducerActionType.DELETE_CARD_ALL, });
        dispatch({ type: FavoritesReducerActionType.DELETE_FAVORITES_ALL, })
    };
    return (
        <div className="min-h-full">
            <Popover as="header" className="bg-gradient-to-r pb-24 bg-white-container-header">
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                            <div className="relative flex flex-wrap items-center justify-center lg:justify-between">
                                {/* Logo */}
                                <div className="absolute left-0 flex-shrink-0 py-5 lg:static hidden lg:block">
                                    <Link to="/" >
                                        <h1 className="text-neon text-white text-9xl mb-1 mt-2 hover:text-indigo-300">estro</h1>
                                        <p className="text-neon text-white text-sx mb-2 hover:text-indigo-100">{t('Logo_Paragraph')}</p>
                                    </Link>
                                </div>

                                {/* Right section on desktop */}
                                <div className="hidden lg:ml-4 lg:flex lg:items-center lg:py-5 lg:pr-0.5">
                                    <button
                                        type="button"
                                        className="relative flex-shrink-0 rounded-full p-1 text-indigo-200 hover:bg-white hover:bg-opacity-10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                    >
                                        <span className="absolute -inset-1.5" />
                                        <span className="sr-only">View notifications</span>
                                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>

                                    {/* Profile dropdown */}
                                    <Menu as="div" className="relative ml-4 flex-shrink-0">
                                        <div>
                                            <Menu.Button className="relative flex rounded-full bg-white text-sm ring-2 ring-white ring-opacity-20 focus:outline-none focus:ring-opacity-100">
                                                <span className="absolute -inset-1.5" />
                                                <span className="sr-only">Open user menu</span>
                                                <img className="h-8 w-8 rounded-full" src={`${baseUrl}/uploads/${user?.ImagePath || "user404.webp"}`} alt="" />
                                            </Menu.Button>
                                        </div>
                                        <Transition
                                            as={Fragment}
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="absolute -right-2 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                {userNavigation.map((item) => (
                                                    <Menu.Item key={item.name}>
                                                        {({ active }) => (
                                                            item.action === 'logout' ? (
                                                                <Link
                                                                    to={item.to}
                                                                    onClick={handleLogout}
                                                                    className={classNames(
                                                                        active ? 'bg-gray-100' : '',
                                                                        'block px-4 py-2 text-sm text-gray-700 w-full text-left'
                                                                    )}
                                                                >
                                                                    {item.name}
                                                                </Link>
                                                            ) : (
                                                                <Link
                                                                    to={item.to}
                                                                    className={classNames(
                                                                        active ? 'bg-gray-100' : '',
                                                                        'block px-4 py-2 text-sm text-gray-700'
                                                                    )}
                                                                >
                                                                    {item.name}
                                                                </Link>
                                                            )
                                                        )}
                                                    </Menu.Item>
                                                ))}
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>

                                <div className="w-full py-5 lg:border-t lg:border-white lg:border-opacity-20">
                                    <div className="lg:grid lg:grid-cols-3 lg:items-center lg:gap-8">
                                        {/* Left nav */}
                                        <div className="hidden lg:col-span-2 lg:block">
                                            <nav className="flex space-x-4">
                                                {navigation.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        to={item.link}
                                                        className={classNames(
                                                            'text-white rounded-md bg-white bg-opacity-0 px-3 py-2 text-sm font-medium hover:bg-opacity-10'
                                                        )}
                                                        aria-current={item.current ? 'page' : undefined}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                ))}
                                            </nav>
                                        </div>
                                        <div className="px-12 lg:px-0">
                                            {/* Search */}
                                            <div className="mx-auto w-full max-w-xs lg:max-w-md">
                                                <label htmlFor="search" className="sr-only">
                                                    Search
                                                </label>
                                                <div className="relative text-white focus-within:text-gray-600">
                                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                        <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
                                                    </div>
                                                    <input
                                                        id="search"
                                                        className="block w-full rounded-md border-0 bg-white/20 py-1.5 pl-10 pr-3 text-white placeholder:text-white focus:bg-white focus:text-gray-900 focus:ring-0 focus:placeholder:text-gray-500 sm:text-sm sm:leading-6"
                                                        placeholder="Search"
                                                        type="search"
                                                        name="search"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Menu button */}
                                <div className="absolute right-0 flex-shrink-0 lg:hidden">
                                    {/* Mobile menu button */}
                                    <Popover.Button className="relative inline-flex items-center justify-center rounded-md bg-transparent p-2 text-indigo-200 hover:bg-white hover:bg-opacity-10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
                                        <span className="absolute -inset-0.5" />
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </Popover.Button>
                                </div>
                            </div>
                        </div>

                        <Transition.Root as={Fragment}>
                            <div className="lg:hidden">
                                <Transition.Child
                                    as={Fragment}
                                    enter="duration-150 ease-out"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="duration-150 ease-in"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <Popover.Overlay className="fixed inset-0 z-20 bg-black bg-opacity-25" />
                                </Transition.Child>

                                <Transition.Child
                                    as={Fragment}
                                    enter="duration-150 ease-out"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="duration-150 ease-in"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Popover.Panel
                                        focus
                                        className="absolute inset-x-0 top-0 z-30 mx-auto w-full max-w-3xl origin-top transform p-2 transition"
                                    >
                                        <div className="divide-y divide-gray-200 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                                            <div className="pb-2 pt-3">
                                                <div className="flex items-center justify-between px-4 border-b lg:border-white lg:border-opacity-20">
                                                    <div>
                                                        <Link to="/" className="h-8 w-auto">
                                                            <h1 className=" text-4xl mb-1 mt-2 text-gray-900 hover:text-indigo-300">estro</h1>
                                                            <p className=" text-sx mb-2 text-gray-900 hover:text-indigo-300">{t('Logo_Paragraph')}</p>
                                                        </Link>
                                                    </div>
                                                    <div className="-mr-2">
                                                        <Popover.Button className="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                                            <span className="absolute -inset-0.5" />
                                                            <span className="sr-only">Close menu</span>
                                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                                        </Popover.Button>
                                                    </div>
                                                </div>
                                                <div className="mt-3 space-y-1 px-2">
                                                    {navigation.map((item) => (
                                                        <Link
                                                            key={item.name}
                                                            to={item.link}
                                                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="pb-2 pt-4">
                                                <div className="flex items-center px-5">
                                                    <div className="flex-shrink-0">
                                                        <img className="h-10 w-10 rounded-full" src={`${baseUrl}/uploads/${user?.ImagePath || "user404.webp"}`} alt="" />
                                                    </div>
                                                    <div className="ml-3 min-w-0 flex-1">
                                                        <div className="truncate text-base font-medium text-gray-800">{user?.FirstName} {user?.LastName}</div>
                                                        <div className="truncate text-sm font-medium text-gray-500">{user?.Email}</div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="relative ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                    >
                                                        <span className="absolute -inset-1.5" />
                                                        <span className="sr-only">View notifications</span>
                                                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                                <div className="mt-3 space-y-1 px-2">
                                                    {userNavigation.map((item) => (
                                                        item.action === 'logout' ? (
                                                            <Link
                                                                to={item.to}
                                                                key={item.name}
                                                                onClick={handleLogout}
                                                                className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800 w-full text-left"
                                                            >
                                                                {item.name}
                                                            </Link>
                                                        ) : (
                                                            <Link
                                                                key={item.name}
                                                                to={item.to}
                                                                className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                                                            >
                                                                {item.name}
                                                            </Link>
                                                        )
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </Popover.Panel>
                                </Transition.Child>
                            </div>
                        </Transition.Root>
                    </>
                )}
            </Popover>
        </div>

    )
}