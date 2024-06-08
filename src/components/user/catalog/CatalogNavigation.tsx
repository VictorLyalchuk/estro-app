import { Fragment, useEffect, useState } from 'react'
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import { ArrowLongLeftIcon, ArrowLongRightIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import { IProduct, IStorages } from '../../../interfaces/Catalog/IProduct.ts';
import { Link, useParams, useNavigate } from "react-router-dom";
import qs, { ParsedQs } from 'qs';
import { ICategory } from '../../../interfaces/Catalog/IMainCategory.ts';
import { IInfo } from '../../../interfaces/Info/IInfo.ts';
import { APP_ENV } from "../../../env/config.ts";
import { getProductsist, getQuantityProducts } from '../../../services/product/product-services.ts';
import { updateFilters, createQueryParams, onPageChangeQueryParams, onSortChangeQueryParams } from '../../../utils/catalog/filterUtils.ts';
import ProductQuickview from './ProductQuickview.tsx';
import { ISortOptions } from '../../../interfaces/Catalog/ISortOptions.ts';
import { getCategoryList } from '../../../services/category/category-services.ts';
import { getInfoList } from '../../../services/info/info-services.ts';

let sortOptions: ISortOptions[] = [
  { name: 'Newest', url: 'newest', current: false },
  { name: 'Most Popular', url: 'most_popular', current: false },
  { name: 'Best Rating', url: 'best_rating', current: false },
  { name: 'Price: Low to High', url: 'price_low_to_high', current: false },
  { name: 'Price: High to Low', url: 'price_high_to_low', current: false },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function CatalogNavigation() {
  const baseUrl = APP_ENV.BASE_URL;
  const navigate = useNavigate();
  const { subName, urlName } = useParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [productList, setProduct] = useState<IProduct[]>([]);
  const [categoryList, setCategoryList] = useState<ICategory[]>([]);
  const [filterOptionsList, setFilterOptionsList] = useState<IInfo[]>([]);
  const [filters, setFilters] = useState<{ name: string; values: string[] }[]>([]);
  const [gridView, setGridView] = useState<string>("3");
  const [itemsPerPage, setItemsPerPage] = useState<number>(6);
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

  if (endPage - startPage + 1 < visiblePages) {
    startPage = Math.max(1, endPage - visiblePages + 1);
  };

  const onViewModeChange = () => {
    const newGridView = gridView === "3" ? "4" : "3";
    const newItemsPerPage = gridView === "3" ? 8 : 6;

    setGridView(newGridView);
    setItemsPerPage(newItemsPerPage);
  }

  const onSortModeChange = (selectedOption: ISortOptions) => {
    setActiveSortOption(selectedOption);
    const updatedSortOptions = sortOptions.map(option =>
      option.name === selectedOption.name
        ? { ...option, current: true }
        : { ...option, current: false }
    );
    sortOptions = updatedSortOptions;

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
    sortOptions = updatedSortOptions;
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

  const loadFromURL = async () => {
    try {
      // створення і відправка даних на сервер
      const newFilters = parseUrlQuery();
      setFilters(newFilters);

      const filterDTO: IFilterDTO = {
        Size: newFilters.find(f => f.name === 'Size')?.values || undefined,
        Material: newFilters.find(f => f.name === 'Material')?.values || undefined,
        Color: newFilters.find(f => f.name === 'Color')?.values || undefined,
        Purpose: newFilters.find(f => f.name === 'Purpose')?.values || undefined,
        Page: newFilters.find(f => f.name === 'Page')?.values || page,
        ItemsPerPage: newFilters.find(f => f.name === 'ItemsPerPage')?.values || itemsPerPage,
        Sort: newFilters.find(f => f.name === 'Sort')?.values?.join('_') || undefined
      };

      onSortModeLoad(newFilters.find(f => f.name === 'Sort')?.values?.join('_') || null);

      if (subName && urlName) {
        const responseQuantity = await getQuantityProducts(subName, urlName, filterDTO);
        const quantity = responseQuantity;
        setCountPage(quantity);

        const responseProduct = await getProductsist(subName, urlName, filterDTO);
        setProduct(responseProduct);
      }
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
    // Витягування категорій і фільтрів з бази даних
    if (subName) {
      getCategoryList(subName)
        .then(data => setCategoryList(data))
        .catch(error => console.error('Error fetching categories data:', error));
      getInfoList(subName)
        .then(data => setFilterOptionsList(data))
        .catch(error => console.error('Error fetching infos data:', error));
    }
  }, [subName, urlName]);

  useEffect(() => {
    loadFromURL();
  }, [subName, urlName, location.search, page, itemsPerPage]);

  return (
    <div className="bg-gray-100 ">
      <div>
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileFiltersOpen}>
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
                  <form className="mt-4 border-t border-gray-200">
                    <h3 className="sr-only">Categories</h3>
                    <ul role="list" className="px-2 py-3 font-medium text-gray-900">
                      {categoryList.map((category) => (
                        <li key={category.name}>

                          <Link
                            to={category.urlName === urlName ? "#" : `/catalog/${subName}/${category.urlName}`}
                            className={`block px-2 py-3 ${category.urlName === urlName ? "font-bold text-gray-700 " : "text-gray-400 hover:text-indigo-500"}`}
                          >
                            {category.name}
                          </Link>
                        </li>
                      ))}
                    </ul>

                    {filterOptionsList.map((section) => (
                      <Disclosure as="div" key={section.id} className="border-t border-gray-200 px-4 py-6">
                        {({ open }) => (
                          <>
                            <h3 className="-mx-2 -my-3 flow-root">
                              <Disclosure.Button className="flex w-full items-center justify-between bg-gray-100 px-2 py-3 text-gray-400 hover:text-gray-500">
                                <span className="font-medium text-gray-900">{section.name}</span>
                                <span className="ml-6 flex items-center">
                                  {open ? (
                                    <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                  ) : (
                                    <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                  )}
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
                                      value={option.value}
                                      type="checkbox"
                                      checked={filters.some((filter) => filter.name === section.name && filter.values.includes(option.value))}
                                      onChange={() => {
                                        createFilters(section.name, option.value);
                                      }}

                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label
                                      htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                      className="ml-3 min-w-0 flex-1 text-gray-500"
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
        <main className="mx-auto max-w-7xl px-2 sm:px-2 lg:px-2 ">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-2 pt-4">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 pb-4">Category</h1>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
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
                  <Menu.Items className="cursor-pointer absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-gray-100 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <a
                              // href={option.href}
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

              <button type="button" onClick={onViewModeChange} className="-m-2 ml-5 p-2 text-gray-400 hover:text-indigo-600 sm:ml-7">
                <span className="sr-only">View grid</span>
                <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <h2 id="products-heading" className="sr-only">
            Products
          </h2>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            {/* Filters */}
            <form className="hidden lg:block">
              <div className=' px-2 py-8 ' style={{ minWidth: '280px' }}>
                <h3 className="sr-only">Categories</h3>
                <ul role="list" className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-500">
                  {categoryList.map((category) => (
                    <li key={category.name}>
                      <Link
                        to={category.urlName === urlName ? "#" : `/catalog/${subName}/${category.urlName}`}
                        className={`block ${category.urlName === urlName ? "font-bold text-gray-700 " : "text-gray-400 hover:text-indigo-500"}`}
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="pt-6 space-y-4 border-b border-gray-200 pb-6">
                  <Link to={{}} className='rounded border-gray-300 hover:text-indigo-500 focus:ring-indigo-500'
                    onClick={resetFilters}>
                    Reset filters
                  </Link>
                </div>
                {filterOptionsList.map((section) => (
                  <Disclosure as="div" key={section.id} className="border-b border-gray-200 py-6"
                  // defaultOpen={true}
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-gray-100 py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">{section.name}</span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon className="h-5 w-5" aria-hidden="true" />
                              ) : (
                                <PlusIcon className="h-5 w-5" aria-hidden="true" />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-4">
                            {section.options?.map((option, optionIdx) => (
                              <div key={option.value} className="flex items-center ">
                                <input
                                  id={`filter-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  value={option.value}
                                  type="checkbox"
                                  checked={filters.some((filter) => filter.name === section.name && filter.values.includes(option.value))}
                                  onChange={() => {
                                    createFilters(section.name, option.value);
                                  }}

                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 "
                                />
                                <label
                                  htmlFor={`filter-${section.id}-${optionIdx}`}
                                  className="ml-3 text-sm text-gray-600 hover:text-indigo-500 cursor-pointer"
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

              </div>
            </form>

            {/* Product grid */}
            <div className="lg:col-span-3  ">
              <div className="overflow-hidden rounded-sm dark:border-strokedark dark:bg-boxdark bg-gray-100">
                <div className="mx-auto max-w-2xl px-2 py-8  lg:max-w-7xl lg:px-2 bg-gray-100">
                  {/* <h2 className="text-2xl font-bold tracking-tight text-gray-900">Customers also purchased</h2> */}
                  <div className={`min-h-[970px] mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-${gridView} xl:gap-x-8 pb-8 transition-all duration-500`}>
                    {productList.slice(0, itemsPerPage).map((product) => (
                      <div key={product.id} className="group relative">
                        <Link to={`/product/${product.id}`}>
                          <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md lg:aspect-none lg:h-80 hover14 hover13">
                            <img
                              src={`${baseUrl}/uploads/1200_${product.images?.[0]?.imagePath || '/uploads/default.jpg'}`}
                              alt={product.name}
                              className="h-full w-full lg:h-full lg:w-full object-cover object-center"
                            />
                          </div>
                          <div className="mt-4 flex justify-between">
                            <div>
                              <h3 className="text-xs text-gray-700 meta-5 font-bold line-clamp-2 break-words w-30">
                                {product.name}
                              </h3>
                              <p className="mt-1 text-xs text-gray-500">{product.article}</p>
                              <p className="mt-1 text-xs text-gray-500">{product.purpose}</p>
                            </div>
                            <p className="text-sm font-bold text-red-800 whitespace-nowrap" >{product.price.toLocaleString('uk-UA', { minimumFractionDigits: 2 })} ₴</p>
                          </div>
                        </Link>

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
                  <div className="container mx-auto p-4 flex relative max-w-7xl lg:flex-row justify-between">
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

                </div>
              </div>
            </div>
          </div>
          {/* </section> */}
        </main>
      </div>
    </div>
  )
}