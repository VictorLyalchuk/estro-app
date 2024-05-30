import { Fragment, useEffect, useState } from 'react'
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import axios from "axios";
import { IProduct } from '../../../interfaces/Site/IProduct.ts';
import { Link, useParams, useNavigate } from "react-router-dom";
import qs, { ParsedQs } from 'qs';
import { ICategory } from '../../../interfaces/Site/IMainCategory.ts';
import { IInfo } from '../../../interfaces/Info/IInfo.ts';
import PaginationCatalog from './PaginationCatalog.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { PaginationReducerCatalogActionType } from './CatalogPaginationReducer.tsx';
import { APP_ENV } from "../../../env/config.ts";

const sortOptions = [
  { name: 'Most Popular', href: '#', current: true },
  { name: 'Best Rating', href: '#', current: false },
  { name: 'Newest', href: '#', current: false },
  { name: 'Price: Low to High', href: '#', current: false },
  { name: 'Price: High to Low', href: '#', current: false },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function CategoryFilters() {
  const baseUrl = APP_ENV.BASE_URL;
  const { subName, urlName } = useParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [productList, setProduct] = useState<IProduct[]>([]);
  const [categoryList, setCategoryList] = useState<ICategory[]>([]);
  const [filterOptionsList, setFilterOptionsList] = useState<IInfo[]>([]);
  const [filters, setFilters] = useState<{ name: string; values: string[] }[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const page = useSelector((state: { paginationProduct: { currentPage: number | null } }) => state.paginationProduct.currentPage);

  const createFilters = async (name: string, value: string) => {
    const newFilters = [...filters];
    const index = newFilters.findIndex((item) => item.name === name);

    if (index === -1) {
      newFilters.push({ name: name, values: [value] });
    } else {
      const valueIndex = newFilters[index].values.indexOf(value);
      if (valueIndex === -1) {
        newFilters[index].values.push(value);
      } else {
        newFilters[index].values.splice(valueIndex, 1);
      }

      if (newFilters[index].values.length === 0) {
        newFilters.splice(index, 1);
      }
    }
    await setFilters(newFilters);



    dispatch({
      type: PaginationReducerCatalogActionType.CURRENT_CATALOG_PAGE,
      payload: { currentPage: 1 },
    });

    // Формування url link in browse
    const queryParams: { [key: string]: string | string[] } = {};
    newFilters.forEach((filter) => {
      if (filter.values.length > 0) {
        queryParams[filter.name] = filter.values.join('_');
      }
    });
    const newQueryString = qs.stringify(queryParams, { encodeValuesOnly: true, delimiter: ';' });
    navigate({ search: newQueryString });
  };

  const ResetFilters = () => {
    const newQueryString = ""
    navigate({ search: newQueryString });
    setFilters([]);
  }
  useEffect(() => {
    dispatch({
      type: PaginationReducerCatalogActionType.CURRENT_CATALOG_PAGE,
      payload: { currentPage: 1 },
    });
  }, [subName, urlName]);

  useEffect(() => {

    // Витягування категорій і фільтрів з бази даних
    const Load = async () => {
      const resp = await axios.get<ICategory[]>(`${baseUrl}/api/CategoryControllers/CategoryGetWithSub`, {
        params: { subName }
      });
      setCategoryList(resp.data);

      const respFilterOptions = await axios.get<IInfo[]>(`${baseUrl}/api/Info/GetInfo/${subName}`,);
      setFilterOptionsList(respFilterOptions.data);

      // завантаження даних з url, їх перетворення та присвоєння у filters із затримкою
      try {
        const queryParams: ParsedQs = qs.parse(location.search, { ignoreQueryPrefix: true, delimiter: ';' });

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
        await setFilters(newFilters);

        dispatch({
          type: PaginationReducerCatalogActionType.UPDATE_FILTERS,
          payload: { filters: newFilters },
        });

        // створення і відправка даних на сервер

        const filterDTO = {
          Size: newFilters.find(f => f.name === 'Size')?.values || undefined,
          Material: newFilters.find(f => f.name === 'Material')?.values || undefined,
          Color: newFilters.find(f => f.name === 'Color')?.values || undefined,
          Purpose: newFilters.find(f => f.name === 'Purpose')?.values || undefined,
          Page: newFilters.find(f => f.name === 'Page')?.values || page

        };
        const quantityResponse = axios.get<number>(`${baseUrl}/api/Product/ProductQuantityByFilters/${subName}/${urlName}`, {
          params: filterDTO,
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: 'repeat' });
          }
        });

        const quantity = (await quantityResponse).data;
        dispatch({
          type: PaginationReducerCatalogActionType.TOTAL_CATALOG_PRODUCTS,
          payload: {
            totalProducts: quantity
          }
        });


        const resp = await axios.get<IProduct[]>(`${baseUrl}/api/Product/FilterProducts/${subName}/${urlName}`, {
          params: filterDTO,
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: 'repeat' });
          }
        });
        setProduct(resp.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    Load();
  }, [subName, urlName, location.search, page]);

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
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-gray-100 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <a
                              href={option.href}
                              className={classNames(
                                option.current ? 'font-medium text-gray-900' : 'text-gray-500',
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

              <button type="button" className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
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

          {/* <section aria-labelledby="products-heading" className="pb-24 pt-6"> */}
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
                    onClick={ResetFilters}>
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
            <div className="lg:col-span-3">
              {/* <Catalog></Catalog> */}
              <div className="min-h-[950px] overflow-hidden rounded-sm dark:border-strokedark dark:bg-boxdark bg-gray-100">
                {/* <CategoryFilters></CategoryFilters> */}
                <PaginationCatalog></PaginationCatalog>
                <div className="mx-auto max-w-2xl px-2 py-8  lg:max-w-7xl lg:px-2 bg-gray-100">
                  {/* <h2 className="text-2xl font-bold tracking-tight text-gray-900">Customers also purchased</h2> */}
                  <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                    {productList.map((product) => (
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
                              <h3 className="text-xs text-gray-700 meta-5 font-bold">
                                {product.name}
                              </h3>
                              <p className="mt-1 text-xs text-gray-500">{product.article}</p>
                              <p className="mt-1 text-xs text-gray-500">{product.purpose}</p>
                            </div>
                            <p className="text-sm font-bold text-red-800">{product.price.toLocaleString('uk-UA', { minimumFractionDigits: 2 })} ₴</p>
                          </div>
                        </Link>
                      </div>
                    ))}
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