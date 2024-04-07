import { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import React from 'react';
import { PaginationReducerActionType } from '../pages/TableProductsReducer';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {APP_ENV} from "../../../env/config";

const productsPerPage = 10;

export default function PaginationFullProducts() {
    const baseUrl = APP_ENV.BASE_URL;
    const dispatch = useDispatch();
    const page = useSelector((state: { paginationProdDashboard: { currentPage: number | null } }) => state.paginationProdDashboard.currentPage);
    const totalProducts = useSelector((state: { paginationProdDashboard: { totalProducts: number | null } }) => state.paginationProdDashboard.totalProducts!);
    const [currentPage, setCurrentPage] = useState<number>(page ?? 1);

    //    const totalProducts = 97;

    const totalPages = Math.ceil(totalProducts / productsPerPage);

    const handlePageClick = (page: number) => {
        setCurrentPage(page);
        dispatch({
            type: PaginationReducerActionType.CURRENT_PAGE,
            payload: { currentPage: page },
        });
    };

    useEffect(() => {
        axios.get<number>(`${baseUrl}/api/Product/ProductQuantity`)
            .then(resp => {
                dispatch({
                    type: PaginationReducerActionType.TOTAL_PRODUCTS,
                    payload: {
                        totalProducts: resp.data
                    }
                });
            });
    }, [dispatch, totalProducts]);



    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }

        if (totalPages <= 9) {
            return pageNumbers.map((page) => (
                <button
                    key={page}
                    onClick={() => handlePageClick(page)}
                    className={`relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === page
                            ? 'custom-button-style bg-indigo-600 text-white focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                        }`}
                >
                    {page}
                </button>
            ));
        }

        const pagesToShow = [];
        if (currentPage <= 2) {
            pagesToShow.push(...pageNumbers.slice(0, 2), '...', totalPages);
        } else if (currentPage >= totalPages - 2) {
            pagesToShow.push(1, '...', ...pageNumbers.slice(totalPages - 2, totalPages));
        } else {
            pagesToShow.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
        }

        return pagesToShow.map((page, index) => (
            <React.Fragment key={index}>
                {page === '...' ? (
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                        ...
                    </span>
                ) : (
                    <button
                        onClick={() => handlePageClick(page as number)}
                        className={`relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === page
                                ? 'bg-indigo-600 text-white focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600'
                                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                            }`}
                    >
                        {page}
                    </button>
                )}
            </React.Fragment>
        ));
    };

    return (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
                <button
                    onClick={() => handlePageClick(currentPage - 1)}
                    className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-white hover:bg-gray-50'
                        }`}
                    disabled={currentPage === 1}
                >
                    {currentPage === 1 ? 'Start' : 'Previous'}
                </button>
                <button
                    onClick={() => handlePageClick(currentPage + 1)}
                    className={`relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-white hover:bg-gray-50'
                        }`}
                    disabled={currentPage === totalPages}
                >
                    {currentPage === totalPages ? 'End' : 'Next'}
                </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(currentPage - 1) * productsPerPage + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(currentPage * productsPerPage, totalProducts)}</span> of{' '}
                        <span className="font-medium">{totalProducts}</span> results
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                            onClick={() => handlePageClick(currentPage - 1)}
                            className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline focus:outline-offset-2 focus:outline-indigo-600 ${currentPage === 1 ? 'cursor-not-allowed' : 'hover:text-indigo-600'
                                }`}
                            disabled={currentPage === 1}
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                        {renderPageNumbers()}
                        <button
                            onClick={() => handlePageClick(currentPage + 1)}
                            className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline focus:outline-offset-2 focus:outline-indigo-600 ${currentPage === totalPages ? 'cursor-not-allowed' : 'hover:text-indigo-600'
                                }`}
                            disabled={currentPage === totalPages}
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}