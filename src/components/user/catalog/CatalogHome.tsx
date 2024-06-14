import { Fragment, useEffect, useState } from 'react'
import { Dialog, Disclosure, Menu, Popover, Transition } from '@headlessui/react'
import { ArrowLongLeftIcon, ArrowLongRightIcon, XMarkIcon, HeartIcon as OutlineHeartIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { HeartIcon } from '@heroicons/react/24/solid'
import { IProduct, IStorages } from '../../../interfaces/Product/IProduct'
import { APP_ENV } from '../../../env/config'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { IInfo } from '../../../interfaces/Info/IInfo'
import { createQueryParams, onPageChangeQueryParams, onSortChangeQueryParams, updateFilters } from '../../../utils/catalog/filterUtils'
import { ISortOptions } from '../../../interfaces/Catalog/ISortOptions'
import qs, { ParsedQs } from 'qs'
import { getProductsist, getQuantityProducts } from '../../../services/product/product-services'
import { getInfoList } from '../../../services/info/info-services'
import ProductQuickview from '../product/ProductQuickview'
import { initialSortOptions } from '../../../data/initialSortOptions'
import { getMainCategories } from '../../../services/category/category-services'
import { addFavoriteProduct, removeFavoriteProduct } from '../../../services/favoriteProducts/favorite-products-services'
import { IAuthReducerState } from '../../../store/accounts/AuthReducer'
import { useDispatch, useSelector } from 'react-redux'
import { addToFavorite, removeFromFavorite } from '../../../store/favourites/FavouritesReducer'
import { RootState } from '../../../store/store'
import { IFavoriteProducts } from '../../../interfaces/FavoriteProducts/IFavoriteProducts'

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function CatalogHome() {
    const { user } = useSelector((redux: any) => redux.auth as IAuthReducerState);
    const favoriteProducts = useSelector((state: RootState) => state.favourites.favoriteProducts);
    const isFavorite = (productId: number) => favoriteProducts.some((product: { productId: number }) => product.productId === productId);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const baseUrl = APP_ENV.BASE_URL;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { main } = useParams();
    const [productList, setProduct] = useState<IProduct[]>([]);
    const [filterOptionsList, setFilterOptionsList] = useState<IInfo[]>([]);
    const [filters, setFilters] = useState<{ name: string; values: string[] }[]>([]);
    const [itemsPerPage] = useState<number>(10);
    const [page, setPage] = useState(1);
    const [countPage, setCountPage] = useState(0);
    const indexOfLastItem = page * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const totalPages = Math.ceil(countPage / itemsPerPage);
    const visiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(visiblePages / 2));
    let endPage = Math.min(totalPages, startPage + visiblePages - 1);
    const [focusedProduct, setFocusedProduct] = useState<IProduct | null>(null);
    const [isQuickviewOpen, setQuickviewOpen] = useState(false);
    const [selectedSize, setSelectedSize] = useState<IStorages | null>(null);
    const [activeSortOption, setActiveSortOption] = useState<ISortOptions | null>(null);
    const [sortOptions, setSortOptions] = useState<ISortOptions[]>(initialSortOptions);
    const [subCategoryIndex, setSubCategoryIndex] = useState(0);
    const [categoriesLoaded, setCategoriesLoaded] = useState(false);
    const filterValueCounts = filterOptionsList.map((section) =>
        filters.reduce((count, filter) => {
            if (filter.name === section.value) {
                count += filter.values.length;
            }
            return count;
        }, 0)
    );

    if (endPage - startPage + 1 < visiblePages) {
        startPage = Math.max(1, endPage - visiblePages + 1);
    };

    const onSortModeChange = (selectedOption: ISortOptions) => {
        setActiveSortOption(selectedOption);
        const updatedSortOptions = sortOptions.map(option =>
            option.name === selectedOption.name
                ? { ...option, current: true }
                : { ...option, current: false }
        );
        setSortOptions(updatedSortOptions);

        const queryParams = onSortChangeQueryParams(selectedOption.url, filters);
        const newQueryString = qs.stringify(queryParams, { encodeValuesOnly: true, delimiter: ';' });
        navigate({ search: newQueryString });
    };

    const onSortModeLoad = (selectedOption: string | null) => {
        const updatedSortOptions = sortOptions.map(option =>
            option.url === selectedOption
                ? { ...option, current: true }
                : { ...option, current: false }
        );
        setSortOptions(updatedSortOptions);
        setActiveSortOption(updatedSortOptions.find(option => option.current) || null);
    };

    const onPageChange = (newPage: number) => {
        setPage(newPage);
        const queryParams = onPageChangeQueryParams(newPage, filters);
        const newQueryString = qs.stringify(queryParams, { encodeValuesOnly: true, delimiter: ';' });
        navigate({ search: newQueryString });
    };

    const createFilters = async (name: string, value: string) => {
        const newFilters = updateFilters(filters, name, value);
        setFilters(newFilters);
        setPage(1);

        const queryParams = createQueryParams(newFilters);
        const newQueryString = qs.stringify(queryParams, { encodeValuesOnly: true, delimiter: ';' });
        navigate({ search: newQueryString });
    };

    const resetFilters = () => {
        const newQueryString = ""
        navigate({ search: newQueryString });
        setFilters([]);
        setPage(1);
        setActiveSortOption(null);
    };

    const parseUrlQuery = (): { name: string; values: string[] }[] => {
        // завантаження даних з url, їх перетворення та присвоєння у filters 
        const queryParams: ParsedQs = qs.parse(location.search, { ignoreQueryPrefix: true, delimiter: ';' });

        if (queryParams['Page']) {
            setPage(parseInt(queryParams['Page'] as string) || 1);
        }
        const newFilters = Object.keys(queryParams).map((name) => {
            let values: string[] = [];
            if (Array.isArray(queryParams[name])) {
                values = queryParams[name] as string[];
            } else if (typeof queryParams[name] === 'string') {
                values = [(queryParams[name] as string)];
            }
            values = values.flatMap((value) => value.split('_'));
            return {
                name,
                values,
            };
        });
        return newFilters;
    };

    const getFilterCategory = async (): Promise<any[]> => {
        const urls: any[] = [];
        const newFilters = parseUrlQuery();
        for (let i = 0; i < subCategoryIndex; i++) {
            const categoryKey = `category-${i + 1}`;
            const urlValue = newFilters.find(f => f.name === categoryKey)?.values;
            if (urlValue) {
                urls.push(urlValue);
            }
        }
        return urls;
    };

    const getInfo = async () => {
        try {
            // Витягування категорій і фільтрів з бази даних
            const mainCategories = await getMainCategories();
            setFilterOptionsList(prevFilters => {
                const mainCategory = mainCategories.find(mainCategory => mainCategory.urlName === main);
                const subCategoryWithOptions: IInfo[] = [];

                if (mainCategory) {
                    mainCategory.subCategories.forEach((subCategory, index) => {
                        const options = subCategory.categories.map(category => ({
                            id: category.id.toString(),
                            label: category.name,
                            value: category.urlName
                        }));

                        subCategoryWithOptions.push({
                            id: subCategory.id.toString(),
                            name: subCategory.name,
                            value: `category-${index + 1}`,
                            options: options
                        });
                    });

                    setSubCategoryIndex(mainCategory.subCategories.length);
                    setCategoriesLoaded(true);
                    return [...prevFilters, ...subCategoryWithOptions];
                }
                return prevFilters;
            });

            const infos = await getInfoList();
            setFilterOptionsList(prevFilters => [...prevFilters, ...infos]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const loadFromURL = async () => {
        try {
            // створення і відправка даних на сервер
            const newFilters = parseUrlQuery();
            setFilters(newFilters);

            const filterDTO: IFilterDTO = {
                Size: newFilters.find(f => f.name === 'size')?.values || undefined,
                Material: newFilters.find(f => f.name === 'material')?.values || undefined,
                Color: newFilters.find(f => f.name === 'color')?.values || undefined,
                Purpose: newFilters.find(f => f.name === 'purpose')?.values || undefined,
                ItemsPerPage: newFilters.find(f => f.name === 'ItemsPerPage')?.values || itemsPerPage,
                Sort: newFilters.find(f => f.name === 'Sort')?.values?.join('_') || undefined,
                Page: newFilters.find(f => f.name === 'Page')?.values || page,
                MainCategory: main,
                SubName: newFilters.find(f => f.name === 'SubName')?.values || undefined,
                UrlName: await getFilterCategory(),
            };

            onSortModeLoad(newFilters.find(f => f.name === 'Sort')?.values?.join('_') || null);

            const responseQuantity = await getQuantityProducts(filterDTO);
            const quantity = responseQuantity;
            setCountPage(quantity);

            const responseProduct = await getProductsist(filterDTO);
            setProduct(responseProduct);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleQuickviewOpen = (product: IProduct, size: IStorages) => {
        setFocusedProduct(product);
        setQuickviewOpen(true);
        setSelectedSize(size);
    };

    useEffect(() => {
        setPage(1);
        getInfo();
    }, []);

    useEffect(() => {
        if (categoriesLoaded) {
            loadFromURL();
        }
    }, [categoriesLoaded, location.search, page, itemsPerPage]);

    const favoriteToggle = async (product: IProduct, e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        e.preventDefault();
        if (user) {
            const favoriteProduct: IFavoriteProducts = {
                userId: user?.Id,
                productId: product.id,
                productName: product.name,
                productPrice: product.price,
                productImage: product.imagesPath?.[0] ?? '',
            };
            if (!isFavorite(product.id)) {
                dispatch(addToFavorite(favoriteProduct));
                await addFavoriteProduct(favoriteProduct);
            } else {
                dispatch(removeFromFavorite(favoriteProduct));
                await removeFavoriteProduct(favoriteProduct);
            }
        }
    };

    return (
        <div className="bg-gray-100">
            <div>
                {/* Mobile filter dialog */}
                <Transition.Root show={mobileFiltersOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-40 sm:hidden" onClose={setMobileFiltersOpen}>
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
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-gray-100 py-4 pb-12 shadow-xl">
                                    <div className="flex items-center justify-between px-4">
                                        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                                        <button
                                            type="button"
                                            className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 p-2 text-gray-400"
                                            onClick={() => setMobileFiltersOpen(false)}
                                        >
                                            <span className="sr-only">Close menu</span>
                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                    </div>

                                    {/* Filters */}
                                    <form className="mt-4">
                                        {filterOptionsList.map((section) => (
                                            <Disclosure as="div" key={section.name} className="border-t border-gray-200 px-4 py-6">
                                                {({ open }) => (
                                                    <>
                                                        <h3 className="-mx-2 -my-3 flow-root">
                                                            <Disclosure.Button className="flex w-full items-center justify-between bg-gray-100 px-2 py-3 text-sm text-gray-400">
                                                                <span className="font-medium text-gray-900 hover:text-indigo-500">{section.name}</span>
                                                                <span className="ml-6 flex items-center">
                                                                    <ChevronDownIcon
                                                                        className={classNames(open ? '-rotate-180' : 'rotate-0', 'h-5 w-5 transform')}
                                                                        aria-hidden="true"
                                                                    />
                                                                </span>
                                                            </Disclosure.Button>
                                                        </h3>
                                                        <Disclosure.Panel className="pt-6">
                                                            <div className="space-y-6">
                                                                {section.options?.map((option, optionIdx) => (
                                                                    <div key={option.value} className="flex items-center">
                                                                        <input
                                                                            id={`filter-mobile-${section.id}-${optionIdx}`}
                                                                            name={`${section.id}[]`}
                                                                            defaultValue={option.value}
                                                                            type="checkbox"
                                                                            checked={filters.some((filter) => filter.name === section.value && filter.values.includes(option.value))}
                                                                            onChange={() => {
                                                                                createFilters(section.value, option.value);
                                                                            }}
                                                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                        />
                                                                        <label
                                                                            htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                                                            className="ml-3 text-sm text-gray-500 hover:text-indigo-500 cursor-pointer"
                                                                        >
                                                                            {option.label}
                                                                        </label>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </Disclosure.Panel>
                                                    </>
                                                )}
                                            </Disclosure>
                                        ))}
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>

                <main>
                    <div className="bg-gray-100">
                        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">ESTRO</h1>
                            <p className="mt-4 max-w-xl text-sm text-gray-700">
                                Our thoughtfully designed workspace objects are crafted in limited runs. Improve your productivity and
                                organization with these sale items before we run out.
                            </p>
                        </div>
                    </div>

                    {/* Filters */}
                    <section aria-labelledby="filter-heading">
                        <h2 id="filter-heading" className="sr-only">
                            Filters
                        </h2>

                        <div className="relative mx-auto max-w-7xl border-b border-gray-200 bg-gray-100 pb-4">
                            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                                <Menu as="div" className="relative inline-block text-left">
                                    <div>
                                        <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-indigo-500">
                                            Sort
                                            <ChevronDownIcon
                                                className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                                aria-hidden="true"
                                            />
                                        </Menu.Button>
                                    </div>

                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="cursor-pointer absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-md bg-gray-100 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <div className="py-1">
                                                {sortOptions.map((option) => (
                                                    <Menu.Item key={option.name}>
                                                        {({ active }) => (
                                                            <a
                                                                onClick={() => onSortModeChange(option)}
                                                                className={classNames(
                                                                    option.current || (active && activeSortOption && activeSortOption.name === option.name)
                                                                        ? 'font-medium text-gray-900' : 'text-gray-500 hover:text-indigo-500',
                                                                    active ? 'bg-gray-100' : '',
                                                                    'block px-4 py-2 text-sm'
                                                                )}
                                                            >
                                                                {option.name}
                                                            </a>
                                                        )}
                                                    </Menu.Item>
                                                ))}
                                            </div>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>

                                <button
                                    type="button"
                                    className="inline-block text-sm font-medium text-gray-700 hover:text-gray-900 hover:text-indigo-500 sm:hidden"
                                    onClick={() => setMobileFiltersOpen(true)}
                                >
                                    Filters
                                </button>

                                <div className="hidden sm:block">
                                    <div className="flow-root">
                                        <Popover.Group className="-mx-4 flex items-center divide-x divide-gray-200">
                                            {filterOptionsList.map((section, index) => (

                                                <Popover key={section.name} className="relative inline-block px-4 text-left">
                                                    <Popover.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-indigo-500 ">
                                                        <span>{section.name}</span>
                                                        {filterValueCounts[index] > 0 && (
                                                            <span className="ml-1.5 rounded bg-gray-200 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-gray-700">
                                                                {filterValueCounts[index]}
                                                            </span>
                                                        )}

                                                        <ChevronDownIcon
                                                            className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                                            aria-hidden="true"
                                                        />
                                                    </Popover.Button>

                                                    <Transition
                                                        as={Fragment}
                                                        enter="transition ease-out duration-100"
                                                        enterFrom="transform opacity-0 scale-95"
                                                        enterTo="transform opacity-100 scale-100"
                                                        leave="transition ease-in duration-75"
                                                        leaveFrom="transform opacity-100 scale-100"
                                                        leaveTo="transform opacity-0 scale-95"
                                                    >
                                                        <Popover.Panel className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-gray-100 p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                            <form className="space-y-4">
                                                                {section.options?.map((option, optionIdx) => (
                                                                    <div key={option.value} className="flex items-center">
                                                                        <input
                                                                            id={`filter-${section.id}-${optionIdx}`}
                                                                            name={`${section.id}[]`}
                                                                            defaultValue={option.value}
                                                                            type="checkbox"
                                                                            checked={filters.some((filter) => filter.name === section.value && filter.values.includes(option.value))}
                                                                            onChange={() => {
                                                                                createFilters(section.value, option.value);
                                                                            }}
                                                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                        />
                                                                        <label
                                                                            htmlFor={`filter-${section.id}-${optionIdx}`}
                                                                            className="cursor-pointer ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900 hover:text-indigo-500"
                                                                        >
                                                                            {option.label}
                                                                        </label>
                                                                    </div>
                                                                ))}
                                                            </form>
                                                        </Popover.Panel>
                                                    </Transition>
                                                </Popover>

                                            ))}

                                        </Popover.Group>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Active filters */}
                        <div className="bg-gray-100">
                            <div className="mx-auto max-w-7xl px-4 py-3 sm:flex sm:items-center sm:px-6 lg:px-8">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Filters
                                    <span className="sr-only">, active</span>
                                </h3>
                                <div aria-hidden="true" className="hidden h-5 w-px bg-gray-300 sm:ml-4 sm:block" />
                                <div className="mt-2 sm:ml-4 sm:mt-0">
                                    <div className="-m-1 flex flex-wrap items-center">
                                        {filterOptionsList.map((section) =>
                                            section.options?.map((option, optionIdx) => {
                                                const isFilterApplied = filters.some(filter => filter.name === section.value && filter.values.includes(option.value));
                                                if (isFilterApplied) {
                                                    return (
                                                        <span
                                                            key={optionIdx}
                                                            className="m-1 inline-flex items-center rounded-full border border-gray-200 bg-gray-100 py-1.5 pl-3 pr-2 text-sm font-medium text-gray-900">
                                                            <span>{option.label}</span>
                                                            <div
                                                                className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500">
                                                                <span className="sr-only">Remove filter for {option.label}</span>
                                                                <button onClick={() => { createFilters(section.value, option.value); }}>
                                                                    <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                                                        <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </span>
                                                    );
                                                }
                                                return null;
                                            })
                                        )}
                                    </div>
                                </div>
                                <div className=" m-1 inline-flex items-center rounded-full border border-gray-200 bg-gray-100 py-1.5 pl-3 pr-2 text-sm font-medium text-gray-900">
                                    <button type="button" onClick={resetFilters} className="text-gray-800 hover:text-indigo-500">
                                        Clear all
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Product grid */}
                    <section
                        aria-labelledby="products-heading"
                        className="mx-auto max-w-2xl px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:max-w-7xl lg:px-8">
                        <h2 id="products-heading" className="sr-only">Products</h2>
                        <div className="min-h-[990px] grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-x-8">
                            {productList.map((product) => (
                                <div key={product.id} className="group relative">
                                    <Link to={`/product/${product.id}`} className="group">
                                        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7  hover13">
                                            <img src={`${baseUrl}/uploads/1200_${product.images?.[0]?.imagePath || '/uploads/default.jpg'}`}
                                                className="h-full w-full object-cover object-center "/>
                                            <div className="absolute top-2 right-2 rounded-full p-2 cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100" aria-hidden="true">
                                                {isFavorite(product.id) ? (
                                                    <HeartIcon className="w-9 h-9 hover:text-indigo-800 stroke-1" onClick={(e) => favoriteToggle(product, e)} />
                                                ) : (
                                                    <OutlineHeartIcon className="w-9 h-9 hover:text-indigo-800 stroke-1" onClick={(e) => favoriteToggle(product, e)} />
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                    <h3 className="mt-4 text-sm text-gray-700 line-clamp-2 break-words w-45">{product.name.split(' ').slice(0, 3).join(' ')}</h3>
                                    <p className="mt-1 text-xs text-gray-500">{product.article}</p>
                                    <p className="mt-1 text-xs text-gray-500">{product.purpose}</p>
                                    <p className="mt-1 text-lg font-medium text-red-900">{product.price.toLocaleString('uk-UA', { minimumFractionDigits: 2 })} ₴</p>
                                    <div className="flex items-end opacity-0 group-hover:opacity-100" aria-hidden="true">
                                        <ul className="mt-4 grid grid-cols-12 gap-2">
                                            <li className="text-xs border-transparent pointer-events-none -inset-px rounded-md">
                                                Size:
                                            </li>
                                            {product.storages?.map((size) => (
                                                size.inStock && (
                                                    <li key={size.size}
                                                        onClick={() => handleQuickviewOpen(product, size)}
                                                        className="cursor-pointer text-xs border-transparent -inset-px rounded-md ml-2 hover:text-indigo-500">
                                                        {size.size}
                                                    </li>
                                                )
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="flex items-end pt-2 opacity-0 group-hover:opacity-100" aria-hidden="true">
                                    </div>
                                    {isQuickviewOpen && focusedProduct && (
                                        <ProductQuickview
                                            product={focusedProduct}
                                            isOpen={isQuickviewOpen}
                                            setOpen={setQuickviewOpen}
                                            size={selectedSize}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        {/* Pagination */}
                        <div className="container mx-auto mt-20 p-4 flex relative max-w-7xl lg:flex-row justify-between">
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between ">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                                        <span className="font-medium">{Math.min(indexOfLastItem, countPage)}</span> of{' '}
                                        <span className="font-medium">{countPage}</span> results
                                    </p>
                                </div>
                            </div>

                            <div>
                                <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
                                    <div className="flex flex-1 justify-between sm:justify-end">
                                        <button
                                            onClick={() => onPageChange(page - 1)}
                                            disabled={page === 1}
                                            className={`inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium 
                                             ${page === 1
                                                    ? 'text-gray-300'
                                                    : 'text-gray-900 hover:border-indigo-500 hover:text-indigo-500'
                                                }`}
                                        >
                                            <ArrowLongLeftIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                                            Previous
                                        </button>
                                    </div>

                                    {[...Array(endPage - startPage + 1)].map((_, index) => {
                                        const pageNumber = startPage + index;
                                        return (
                                            <button
                                                key={pageNumber}
                                                onClick={() => onPageChange(pageNumber)}
                                                className={`inline-flex items-center border-t px-4 pt-4 text-sm font-medium text-gray-500 ${page === pageNumber
                                                    ? 'border-t-2 border-indigo-500 text-indigo-600 font-semibold'
                                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                                    }`}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    })}

                                    <div className="flex flex-1 justify-between sm:justify-end">
                                        <button
                                            onClick={() => onPageChange(page + 1)}
                                            disabled={indexOfLastItem >= countPage}
                                            className={`inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium 
                                             ${indexOfLastItem >= countPage
                                                    ? 'text-gray-300'
                                                    : 'text-gray-900 hover:border-indigo-500 hover:text-indigo-500'
                                                }`}
                                        >
                                            Next
                                            <ArrowLongRightIcon className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                                        </button>
                                    </div>

                                </nav>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}