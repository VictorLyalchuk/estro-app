import { Fragment, SetStateAction, useEffect, useState } from 'react'
import { Dialog, Popover, Tab, Transition } from '@headlessui/react'
import { Bars3Icon, MagnifyingGlassIcon, ShoppingBagIcon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { AuthReducerActionType, IAuthReducerState } from "../../store/accounts/AuthReducer.ts";
import { IMainCategory } from '../../interfaces/Catalog/IMainCategory.ts';
import DropdownUser from './navbarsPages/DropdownUser/DropdownUser.tsx';
import { BagReducerActionType, IBagReducerState } from '../../store/bag/BagReducer.tsx';
import { getMainCategories } from '../../services/category/category-services.ts';
import { getCountBagByEmail } from '../../services/bag/bag-services.ts';

const navigation = {
    featured: [
        {
            name: 'New Arrivals',
            href: '#',
            imageSrc: 'https://tailwindui.com/img/ecommerce-images/mega-menu-category-01.jpg',
            imageAlt: 'Models sitting back to back, wearing Basic Tee in black and bone.',
        },
        {
            name: 'Basic Tees',
            href: '#',
            imageSrc: 'https://tailwindui.com/img/ecommerce-images/mega-menu-category-02.jpg',
            imageAlt: 'Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.',
        },],
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const NavbarsPage = () => {
    const { isAuth, user } = useSelector((redux: any) => redux.auth as IAuthReducerState);
    const { count } = useSelector((redux: any) => redux.bagReducer as IBagReducerState);
    const [categoryList, setCategoryList] = useState<IMainCategory[]>([]);
    const [open, setOpen] = useState(false)
    const dispatch = useDispatch();

    useEffect(() => {
        if (user?.Email) {
            getCountBagByEmail(user?.Email, dispatch);
        }
    }, [count, user]);

    useEffect(() => {
        getMainCategories()
            .then((data: SetStateAction<IMainCategory[]>) => setCategoryList(data))
            .catch(error => console.error('Error fetching categories data:', error));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        dispatch({
            type: AuthReducerActionType.LOGOUT_USER,
        });
        dispatch({
            type: BagReducerActionType.DELETE_ALL,
        });
    };

    return (
        <div className="bg-gray-100 text-body ">
            <nav className="your-navigation-styles z-10 relative">
                {/* Mobile menu */}
                <Transition.Root show={open} as={Fragment}>
                    <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-25" />
                        </Transition.Child>

                        <div className="fixed inset-0 z-40 flex">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-gray-100 pb-12 shadow-xl">
                                    <div className="flex px-4 pb-2 pt-5">
                                        <button
                                            type="button"
                                            className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                                            onClick={() => setOpen(false)}
                                        >
                                            <span className="absolute -inset-0.5" />
                                            <span className="sr-only">Close menu</span>
                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                    </div>

                                    {/* Links */}
                                    <Tab.Group as="div" className="mt-2">
                                        <div className="border-b border-gray-200">
                                            <Tab.List className="-mb-px flex space-x-8 px-4">
                                                {categoryList.map((category) => (
                                                    <Tab
                                                        key={category.name}
                                                        className={({ selected }) =>
                                                            classNames(
                                                                selected ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-900',
                                                                'flex-1 whitespace-nowrap border-b px-1 py-4 text-base font-medium'
                                                            )
                                                        }
                                                    >
                                                        {category.name}
                                                    </Tab>
                                                ))}
                                            </Tab.List>
                                        </div>
                                        <Tab.Panels as={Fragment}>
                                            {categoryList.map((category) => (
                                                <Tab.Panel key={category.name} className="space-y-10 px-4 pb-8 pt-10">
                                                    <div className="grid grid-cols-2 gap-x-4">
                                                        {/* {category.featured.map((item) => (
                                                        <div key={item.name} className="group relative text-sm">
                                                            <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                                                <img src={item.imageSrc} alt={item.imageAlt} className="object-cover object-center" />
                                                            </div>
                                                            <a href={item.href} className="mt-6 block font-medium text-gray-900">
                                                                <span className="absolute inset-0 z-10" aria-hidden="true" />
                                                                {item.name}
                                                            </a>
                                                            <p aria-hidden="true" className="mt-1">
                                                                Shop now
                                                            </p>
                                                        </div>
                                                    ))} */}
                                                    </div>
                                                    {category.subCategories.map((section) => (
                                                        <div key={section.name}>
                                                            <p id={`${category.id}-${section.id}-heading-mobile`} className="font-medium text-gray-900">
                                                                {section.name}
                                                            </p>
                                                            <ul
                                                                role="list"
                                                                aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                                                                className="mt-6 flex flex-col space-y-6"
                                                            >
                                                                {section.categories.map((item) => (
                                                                    <li key={item.name} className="flow-root">
                                                                        <Link to={`/catalog/${section.urlName}/${item.urlName}`} onClick={() => setOpen(false)}>{item.name} </Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </Tab.Panel>
                                            ))}
                                        </Tab.Panels>
                                    </Tab.Group>

                                    <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                                        <Link to={"/store-locations"}
                                            className="flex items-center -mb-px text-sm font-medium text-gray-700 hover:text-indigo-500"
                                        >
                                            Store
                                        </Link>
                                    </div>
                                    {isAuth ? (
                                        <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                                            <div className="flow-root">
                                                <div className="-m-2 block p-2 font-medium text-gray-900">
                                                    <Link to={"/"} onClick={() => { handleLogout(); setOpen(false); }}>Logout ({user?.Email})</Link>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                                            <div className="flow-root">
                                                <div className="-m-2 block p-2 font-medium text-gray-900">
                                                    <Link to={"/login"} onClick={() => setOpen(false)}>Sign in</Link>
                                                </div>
                                            </div>
                                            <div className="flow-root">
                                                <div className="-m-2 block p-2 font-medium text-gray-900">
                                                    <Link to={"/register"} onClick={() => setOpen(false)}>Create account</Link>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="border-t border-gray-200 px-4 py-6">
                                        <a href="#" className="-m-2 flex items-center p-2">
                                            <img
                                                src="../images/ua.webp"
                                                alt=""
                                                className="block h-auto w-5 flex-shrink-0"
                                            />
                                            <span className="ml-3 block text-base font-medium text-gray-900">UA</span>
                                            <span className="sr-only"> change currency</span>
                                        </a>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>

                <header className="relative bg-gray-100 mx-auto max-w-7xl px-2 sm:px-2 lg:px-2">
                    <div className=" items-baseline justify-between border-b border-gray-200 pb-2 pt-2">

                        <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
                            <div>
                                <div className="flex h-16 items-center">
                                    <button
                                        type="button"
                                        className="relative rounded-md bg-gray-100 p-2 text-gray-400 lg:hidden"
                                        onClick={() => setOpen(true)}
                                    >
                                        <span className="absolute -inset-0.5" />
                                        <span className="sr-only">Open menu</span>
                                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                                    </button>

                                    {/* Flyout menus */}
                                    <Popover.Group className="hidden lg:ml-8 lg:block lg:self-stretch">
                                        <div className="flex h-full space-x-8 ">
                                            {categoryList.map((category) => (
                                                <Popover key={category.name} className="flex">
                                                    {({ open }) => (
                                                        <>
                                                            <div className="relative flex">
                                                                <Popover.Button
                                                                    className={classNames(
                                                                        open
                                                                            ? 'border-indigo-600 text-indigo-600 hover:text-indigo-500'
                                                                            : 'border-transparent text-gray-700 hover:text-gray-800 hover:text-indigo-500',
                                                                        'relative z-10 -mb-px flex items-center pt-px text-sm font-medium transition-colors duration-200 ease-out hover:text-indigo-500'
                                                                    )}
                                                                >
                                                                    {category.name}
                                                                </Popover.Button>
                                                            </div>

                                                            <Transition
                                                                as={Fragment}
                                                                enter="transition ease-out duration-200"
                                                                enterFrom="opacity-0"
                                                                enterTo="opacity-100"
                                                                leave="transition ease-in duration-150"
                                                                leaveFrom="opacity-100"
                                                                leaveTo="opacity-0"
                                                            >
                                                                <Popover.Panel className="absolute inset-x-0 top-full text-sm text-gray-500">
                                                                    {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                                                                    <div className="absolute inset-0 top-1/2 bg-gray-100 shadow" aria-hidden="true" />

                                                                    <div className="relative bg-gray-100">
                                                                        <div className="mx-auto max-w-7xl px-8">
                                                                            <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                                                                                <div className="col-start-2 grid grid-cols-2 gap-x-8">
                                                                                    {navigation.featured.map((item) => (
                                                                                        <div key={item.name} className="group relative text-base sm:text-sm">
                                                                                            <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                                                                                <img
                                                                                                    src={item.imageSrc}
                                                                                                    alt={item.imageAlt}
                                                                                                    className="object-cover object-center"
                                                                                                />
                                                                                            </div>
                                                                                            <a href={item.href} className="mt-6 block font-medium text-gray-900">
                                                                                                {/* <span className="absolute inset-0 z-10" aria-hidden="true" /> */}
                                                                                                {item.name}
                                                                                            </a>
                                                                                            <Link to={"/"} aria-hidden="true" className="mt-1">
                                                                                                Shop now
                                                                                            </Link>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                                <div className="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm">
                                                                                    {category.subCategories.map((section) => (

                                                                                        <div key={section.name}>
                                                                                            <p id={`${section.name}-heading`} className="font-bold text-gray-900">
                                                                                                {section.name}
                                                                                            </p>
                                                                                            <ul
                                                                                                role="list"
                                                                                                aria-labelledby={`${section.name}-heading`}
                                                                                                className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                                                                            >
                                                                                                {section.categories.map((item) => (
                                                                                                    <li key={item.name} className="flex hover:text-indigo-500">
                                                                                                        <Popover.Panel>
                                                                                                            {({ close }) => (
                                                                                                                <Link to={`/catalog/${section.urlName}/${item.urlName}`} onClick={() => close()}>
                                                                                                                    {item.name}
                                                                                                                </Link>
                                                                                                            )}
                                                                                                        </Popover.Panel>
                                                                                                    </li>
                                                                                                ))}
                                                                                            </ul>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Popover.Panel>
                                                            </Transition>
                                                        </>
                                                    )}
                                                </Popover>
                                            ))}

                                            <Link to={"/store-locations"}
                                                className="flex items-center -mb-px text-sm font-medium text-gray-700 hover:text-indigo-500"
                                            >
                                                Store
                                            </Link>
                                        </div>
                                    </Popover.Group>

                                    <div className="ml-auto flex items-center">

                                        <div className="hidden lg:ml-8 lg:flex border-r pr-7">
                                            <a href="#" className="flex items-center text-gray-700 hover:text-gray-800">
                                                <img
                                                    src="../images/ua.webp"
                                                    alt=""
                                                    className="block h-auto w-5 flex-shrink-0"
                                                />
                                                <span className="ml-3 block text-sm font-medium">UA</span>
                                                <span className="sr-only">change currency</span>
                                            </a>
                                        </div>
                                        {isAuth ? (
                                            <>
                                                <div className="pl-7">
                                                    <DropdownUser />
                                                </div>
                                            </>
                                        ) : (

                                            <div className="ml-4 flow-root lg:ml-6">
                                                <Link className="group -m-2 p-2 text-gray-400 hover:text-gray-500" to={"/auth"} >
                                                    <UserIcon className="h-6 w-6" aria-hidden="true" />
                                                </Link>
                                            </div>
                                        )}

                                        {/* Search */}
                                        <div className="ml-4 flow-root lg:ml-6">
                                            <a href="#" className="p-2 text-gray-400 hover:text-gray-500">
                                                <div className="sr-only">Search</div>
                                                <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
                                            </a>
                                        </div>

                                        {/* Cart */}
                                        <div className="ml-4 flow-root lg:ml-6">
                                            <Link to={"/bag"} className="group -m-2 ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800 w-20 flex items-center hover:text-gray-500">
                                                <ShoppingBagIcon
                                                    className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500 mr-3"
                                                    aria-hidden="true"
                                                />
                                                {count}</Link>
                                            <div className="sr-only">items in cart, view bag</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </div>
                </header >
            </nav >
        </div >
    )
}
export default NavbarsPage;