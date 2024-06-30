import { Link } from "react-router-dom";
import GoodsNotFound from "../../../../assets/goods-not-found.png";
import { APP_ENV } from "../../../../env/config";
import React from 'react';
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid';
import { OrdersProps } from "../../../../interfaces/ProfileUser/ProfileUserProps";
import { ArrowsPointingInIcon } from "@heroicons/react/24/outline";
import { formatDate } from "../../../../services/custom/format-data";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}


const Orders: React.FC<OrdersProps> = ({ orders, onViewModeChange, page, countPage, onPageChange }) => {
  const baseUrl = APP_ENV.BASE_URL;
  const itemsPerPage = 1;
  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(countPage / itemsPerPage);
  const visiblePages = 5;
  let startPage = Math.max(1, page - Math.floor(visiblePages / 2));
  let endPage = Math.min(totalPages, startPage + visiblePages - 1);

  if (endPage - startPage + 1 < visiblePages) {
    startPage = Math.max(1, endPage - visiblePages + 1);
  }

  return (
    <>
      {orders && orders.length > 0 ? (
        <>
          {orders.map((order, index) => (
            <div key={index} className="bg-white rounded-md shadow-md mb-8 mt-8">
              <div className="mx-auto max-w-2xl pb-8 pt-8 sm:px-6 sm:pt-8 lg:max-w-7xl lg:px-8 ">
                <div className="flex justify-between space-y-2 px-4 border-b border-gray-200 pb-5 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0">
                  <div className="grid grid-rows-1 px-4 py-6 sm:p-6 lg:pb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 ">Order Details</h1>
                    <dl className="flex mt-2">
                      <dt className="text-gray-500">Order #&nbsp;</dt>
                      <dd className="font-medium text-gray-900">{order.id}</dd>
                      <dt>
                        <span className="sr-only">Date</span>
                        <span className="mx-2 text-gray-400" aria-hidden="true">
                          &middot;
                        </span>
                      </dt>
                      <dd className="font-medium text-gray-900">
                        <time>{formatDate(order.orderDate)}</time>
                      </dd>
                    </dl>
                  </div>

                  <div className="flex sm:items-start sm:space-x-4 px-4 py-6 sm:p-6 lg:pb-8">
                    <button onClick={onViewModeChange} className="text-gray-400 hover:text-indigo-600">
                      <span className="sr-only">View grid</span>
                      <ArrowsPointingInIcon className="h-7 w-7" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <section aria-labelledby="products-heading" className="mt-4">
                  <h2 id="products-heading" className="sr-only">
                    Products purchased
                  </h2>

                  <div className="space-y-24">
                    {order.orderItems.map((product, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-8"
                      >
                        <div className="px-4 py-6 sm:col-span-4 md:col-span-5 md:row-span-2 md:row-end-2">
                          <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-50">
                            <img
                              src={`${baseUrl}/uploads/1200_${product?.imagePath || '/uploads/default.jpg'}`}
                              className="object-cover object-center" />
                          </div>
                        </div>
                        <div className="px-4 py-6 mt-6 sm:col-span-7 sm:mt-0 md:row-end-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            <Link to={`/product/${product.productId}`}>{product.name}</Link>
                          </h3>
                          <p className="mt-3 font-medium text-gray-900">Article: {product.article}</p>
                          <p className="mt-3 font-medium text-gray-900">{product.price.toLocaleString('uk-UA', { minimumFractionDigits: 2 })} €</p>
                          <p className="mt-3 font-medium text-gray-900">Quantity: {product.quantity}</p>
                          <p className="mt-3 font-medium text-gray-900">Size: {product.size}</p>
                          <p className="mt-3 text-gray-500">{product.description}</p>
                        </div>
                        <div className="px-4 py-6 sm:col-span-12 md:col-span-7">
                          <dl className="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
                            <div>
                              <dt className="font-medium text-gray-900">Delivery address</dt>
                              <dd className="mt-3 text-gray-500">
                                <span className="block">{order.address.region}</span>
                                <span className="block">{order.address.city}</span>
                                <span className="block">{order.address.street}</span>
                              </dd>
                            </div>
                            <div>
                              <dt className="font-medium text-gray-900">Contacts for delivery</dt>
                              <dd className="mt-3 space-y-3 text-gray-500">
                                <p>{order.email}</p>
                                <p>{order.phoneNumber}</p>
                              </dd>
                            </div>
                          </dl>
                          <p className="mt-6 font-medium text-gray-900 md:mt-10">
                            {product.dueDate === '0001-01-01T00:00:00'
                              ? 'Date not determined'
                              : `${product.status} on `}
                            {product.dueDate !== '0001-01-01T00:00:00' && (
                              <time dateTime={product.dueDate}>{formatDate(product.dueDate)}</time>
                            )}
                          </p>
                          <div className="mt-6">
                            <div className="overflow-hidden rounded-full bg-gray-200">
                              <div
                                className="h-2 rounded-full bg-indigo-600"
                                style={{ width: `calc((${product.step} * 2 + 1) / 8 * 100%)` }}
                              />
                            </div>
                            <div className="mt-6 hidden grid-cols-4 font-medium text-gray-600 sm:grid">
                              <div className="text-indigo-600">Order placed</div>
                              <div className={classNames(product.step > 0 ? 'text-indigo-600' : '', 'text-center')}>
                                Processing
                              </div>
                              <div className={classNames(product.step > 1 ? 'text-indigo-600' : '', 'text-center')}>
                                Shipped
                              </div>
                              <div className={classNames(product.step > 2 ? 'text-indigo-600' : '', 'text-right')}>
                                Delivered
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Billing */}
                <section aria-labelledby="summary-heading" className="mt-24">
                  <h2 id="summary-heading" className="sr-only">
                    Billing Summary
                  </h2>

                  <div className="rounded-lg bg-gray-50 px-6 py-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-0 lg:py-8">
                    <dl className="grid grid-cols-1 gap-6 text-sm sm:grid-cols-2 md:gap-x-8 lg:col-span-5 lg:pl-8">
                      <div>
                        <dt className="font-medium text-gray-900">Billing person</dt>
                        <dd className="mt-3 text-gray-500">
                        <span className="block">{order.firstName}</span>
                        <span className="block">{order.lastName}</span>
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium text-gray-900">Payment information</dt>
                        <dd className="mt-3 flex">
                          <div>
                            <svg aria-hidden="true" width={36} height={24} viewBox="0 0 36 24" className="h-6 w-auto">
                              <rect width={36} height={24} rx={4} fill="#224DBA" />
                              <path
                                d="M10.925 15.673H8.874l-1.538-6c-.073-.276-.228-.52-.456-.635A6.575 6.575 0 005 8.403v-.231h3.304c.456 0 .798.347.855.75l.798 4.328 2.05-5.078h1.994l-3.076 7.5zm4.216 0h-1.937L14.8 8.172h1.937l-1.595 7.5zm4.101-5.422c.057-.404.399-.635.798-.635a3.54 3.54 0 011.88.346l.342-1.615A4.808 4.808 0 0020.496 8c-1.88 0-3.248 1.039-3.248 2.481 0 1.097.969 1.673 1.653 2.02.74.346 1.025.577.968.923 0 .519-.57.75-1.139.75a4.795 4.795 0 01-1.994-.462l-.342 1.616a5.48 5.48 0 002.108.404c2.108.057 3.418-.981 3.418-2.539 0-1.962-2.678-2.077-2.678-2.942zm9.457 5.422L27.16 8.172h-1.652a.858.858 0 00-.798.577l-2.848 6.924h1.994l.398-1.096h2.45l.228 1.096h1.766zm-2.905-5.482l.57 2.827h-1.596l1.026-2.827z"
                                fill="#fff"
                              />
                            </svg>
                            <p className="sr-only">Visa</p>
                          </div>
                          <div className="ml-4">
                            <p className="text-gray-900">Ending with 4242</p>
                            <p className="text-gray-600">Expires 02 / 24</p>
                          </div>
                        </dd>
                      </div>
                    </dl>

                    <dl className="mt-8 divide-y divide-gray-200 text-sm lg:col-span-7 lg:mt-0 lg:pr-8">
                      <div className="flex items-center justify-between pb-4">
                        <dt className="text-gray-600">Subtotal</dt>
                        <dd className="font-medium text-gray-900">{order.subtotal.toLocaleString('uk-UA', { minimumFractionDigits: 2 }).slice(0, -1)} €</dd>
                      </div>
                      <div className="flex items-center justify-between py-4">
                        <dt className="text-gray-600">Tax</dt>
                        <dd className="font-medium text-gray-900">{order.tax.toLocaleString('uk-UA', { minimumFractionDigits: 2 }).slice(0, -1)} €</dd>
                      </div>
                      <div className="flex items-center justify-between py-4">
                        <dt className="text-gray-600">Discount</dt>
                        <dd className="font-medium text-red-600">{order.discount.toLocaleString('uk-UA', { minimumFractionDigits: 2 }).slice(0, -1)} €</dd>
                      </div>
                      <div className="flex items-center justify-between pt-4">
                        <dt className="font-medium text-gray-900">Order total</dt>
                        <dd className="font-medium text-indigo-600">{order.orderTotal.toLocaleString('uk-UA', { minimumFractionDigits: 2 }).slice(0, -1)} €</dd>
                      </div>
                    </dl>
                  </div>
                </section>
              </div>
            </div>
          ))}

          <nav className="flex items-center justify-between bg-white rounded-md shadow-md bg-white px-4 py-3 sm:px-6">
            <div className="container mx-auto p-4 flex relative max-w-7xl lg:flex-row justify-between ">
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
          </nav>
        </>
      ) : (
        <div className="container mx-auto p-8 flex justify-center relative bg-gray-100 mx-auto max-w-7xl px-2 sm:px-2 lg:px-2   flex-col lg:flex-row  ">
          <div className="w-full lg:w-2/4 p-5 mb-8 lg:mb-0">
            <div className="mt-8 flex justify-center">
              <img src={GoodsNotFound}></img>
            </div>
            <div className="mt-8 flex justify-center">
              <p>No orders.</p>
            </div>
          </div>
        </div>

      )}
    </>
  )
}
export default Orders;