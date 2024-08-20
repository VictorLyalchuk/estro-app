import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Modal } from 'antd';
import { APP_ENV } from "../../../env/config";
import { useTranslation } from "react-i18next";
import { Link as Scrollink } from 'react-scroll'
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid';
import { getLocalizedField } from "../../../utils/localized/localized";
import { IMainCategory } from "../../../interfaces/Category/Main-Category/IMainCategory";
import { deleteMainCategoryByID, getMainCategoryByPage, getMainCategoryQuantity } from "../../../services/category/category-services";

export default function MainCategoryList() {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;
    const baseUrl = APP_ENV.BASE_URL;
    const dispatch = useDispatch();
    const [mainCategoryList, setMainCategoryList] = useState<IMainCategory[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [SelectedMainCategory, setSelectedMainCategory] = useState<IMainCategory | null>(null);
    const [page, setPage] = useState(1);
    const [countPage, setCountPage] = useState(0);
    const itemsPerPage = 10;
    const indexOfLastItem = page * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const totalPages = Math.ceil(countPage / itemsPerPage);
    const visiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(visiblePages / 2));
    let endPage = Math.min(totalPages, startPage + visiblePages - 1);

    if (endPage - startPage + 1 < visiblePages) {
        startPage = Math.max(1, endPage - visiblePages + 1);
    }

    const onPageChange = (newPage: number) => {
        setPage(newPage);
    };

    useEffect(() => {
        getMainCategoryByPage(page)
            .then(data => setMainCategoryList(data))
            .catch(error => console.error('Error fetching  main category data:', error));
        getMainCategoryQuantity()
            .then(data => setCountPage(data))
            .catch(error => console.error('Error fetching main category quantity data:', error));
    }, [dispatch, page]);


    const showDeleteConfirm = (mainCategory: IMainCategory) => {
        setSelectedMainCategory(mainCategory);
        setModalVisible(true);
    };

    const handleDeleteMainCategory = () => {
        if (SelectedMainCategory) {
            onPageChange(1);
            deleteMainCategoryByID(SelectedMainCategory?.id)
                .then(() => {
                    return getMainCategoryQuantity();
                })
                .then(data => {
                    setCountPage(data);
                })
                .then(() => {
                    return getMainCategoryByPage(1);
                })
                .then(data => {
                    setMainCategoryList(data);
                })
                .catch(error => {
                    console.error('Error deleting main category:', error);
                });
            setModalVisible(false);
        }
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    return (
        <div className="bg-gray-100 py-10 px-4 sm:px-6 lg:px-8 product-start">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h2 className="px-4 text-base font-semibold leading-7 text-gray-900 sm:px-6 lg:px-8">{t('Main_Category')}</h2>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none px-8">
                    <Link to={"/admin/main-category/add-main-category-en"}
                        className="block rounded-md px-3 py-2 text-center text-sm font-semibold text-white shadow-sm bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        {t('Category_MainCategoryCreate')}
                    </Link>
                </div>
            </div>

            <div className="-mx-4 mt-10 ring-1 ring-gray-200 sm:mx-0 sm:rounded-lg">
                <table className="mt-6 w-full whitespace-nowrap text-left">
                    <colgroup>
                        <col className="lg:w-1/12" />
                        <col className="lg:w-3/12" />
                        <col className="lg:w-3/12" />
                        <col className="lg:w-1/12" />
                        <col className="lg:w-1/12" />
                    </colgroup>
                    <thead className="border-b border-white/10 text-sm leading-6 text-gray-900">
                        <tr>
                            <th scope="col" className="py-2 pl-8 pr-8 font-semibold sm:table-cell">
                                {t('Category_Id')}
                            </th>
                            <th scope="col" className="py-2 pl-8 pr-8 font-semibold sm:table-cell">
                                {t('Category_Name')}
                            </th>
                            <th scope="col" className="py-2 pl-8 pr-8 font-semibold hidden lg:table-cell">
                                {t('Category_Description')}
                            </th>
                            <th scope="col" className="py-2 pl-8 pr-4 font-semibold hidden sm:table-cell sm:pr-8 sm:text-left lg:pr-20">
                                {t('Category_URLName')}
                            </th>
                            <th scope="col" className="py-2 pl-8 pr-4 font-semibold sm:table-cell sm:pr-6 lg:pr-8">
                                {t('Products_Actions')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {mainCategoryList.map((mainCategory) => (
                            <tr key={mainCategory.id} className="text-gray-700 hover:bg-gray-200 ">
                                <td className="py-4 pl-8 pr-4 sm:table-cell sm:pr-8 border-t border-b border-gray-200 hover:border-gray-100">
                                    <div className="font-mono text-sm leading-6">{mainCategory.id}</div>
                                </td>
                                <td className="py-4 pl-8 pr-4 sm:table-cell sm:pr-8 border-t border-b border-gray-200 ">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                        {mainCategory.imagePath && mainCategory.imagePath.length > 0 ? (
                                            <img src={`${baseUrl}/uploads/${mainCategory.imagePath || '/uploads/default.jpg'}`} className="w-30 rounded-lg" />
                                        ) : (
                                                <img
                                                    src={`${baseUrl}/uploads/imagenot.webp`}
                                                    alt="Image Not Available"
                                                    className="w-30 rounded-lg"
                                                />
                                        )}
                                        <Link to={`/catalog-home/${mainCategory.urlName}`} className="hover:text-indigo-500 ">
                                            <div className="font-mono text-sm leading-6">{getLocalizedField(mainCategory, 'name', lang)}</div>
                                        </Link>
                                    </div>
                                </td>
                                <td className="py-4 pl-8 pr-4 text-sm leading-6 hidden lg:table-cell sm:pr-8 lg:pr-20 border-t border-b border-gray-200">
                                {getLocalizedField(mainCategory, 'description', lang) || '-'}
                                </td>
                                <td className="py-4 pl-8 pr-4 text-sm leading-6 hidden sm:table-cell sm:pr-8 lg:pr-20 border-t border-b border-gray-200">
                                    {mainCategory.urlName}
                                </td>

                                <td className="py-4 pl-8 pr-4 text-right text-sm leading-6 sm:table-cell sm:pr-6 lg:pr-8 border-t border-b border-gray-200">
                                    <Link to={`/admin/main-category/edit-main-category-en/${mainCategory.id}`} className="mb-2 block mx-auto w-full rounded-md px-3 py-2 text-center text-sm font-semibold text-white shadow-sm bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                        {t('Category_Edit_MainCategory')}
                                    </Link>
                                    <button className="block mx-auto w-full rounded-md px-3 py-2 text-center text-sm font-semibold text-white shadow-sm bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        onClick={() => showDeleteConfirm(mainCategory)}>
                                        {t('Category_Delete_MainCategory')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <nav className="flex items-center justify-between bg-white rounded-md shadow-md bg-white px-4 py-3 sm:px-6">
                    <div className="container mx-auto p-4 flex relative max-w-7xl lg:flex-row justify-between ">
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between ">
                            <div>
                                <p className="text-sm text-gray-700">
                                    {t('Order_Showing')} <span className="font-medium">{indexOfFirstItem + 1}</span> {t('Order_To')}{' '}
                                    <span className="font-medium">{Math.min(indexOfLastItem, countPage)}</span> {t('Order_Of')}{' '}
                                    <span className="font-medium">{countPage}</span> {t('Order_Results')}
                                </p>
                            </div>
                        </div>
                        <div>
                            <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
                                <div className="flex flex-1 justify-between sm:justify-end">
                                    <Scrollink to="product-start" smooth={true}>
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
                                            {t('Order_Previous')}
                                        </button>
                                    </Scrollink>

                                    {[...Array(endPage - startPage + 1)].map((_, index) => {
                                        const pageNumber = startPage + index;
                                        return (
                                            <Scrollink to="product-start" smooth={true} key={pageNumber}>
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
                                            </Scrollink>
                                        );
                                    })}

                                    <Scrollink to="product-start" smooth={true}>
                                        <button
                                            onClick={() => onPageChange(page + 1)}
                                            disabled={indexOfLastItem >= countPage}
                                            className={`inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium 
                                                 ${indexOfLastItem >= countPage
                                                    ? 'text-gray-300'
                                                    : 'text-gray-900 hover:border-indigo-500 hover:text-indigo-500'
                                                }`}
                                        >
                                            {t('Order_Next')}
                                            <ArrowLongRightIcon className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                                        </button>
                                    </Scrollink>

                                </div>
                            </nav>
                        </div>
                    </div>
                </nav>

            </div>

            <Modal
                title={t('Category_Delete_MainCategory')}
                open={modalVisible}
                onCancel={handleCancel}
                footer={null}
                className="custom-modal"
            >
                <p>{t('Category_Model')}</p>
                <div className="flex justify-end gap-4 mt-4">
                <button
                    key="delete"
                    type="button"
                    onClick={handleDeleteMainCategory}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    {t('Category_Delete')}
                </button>
                <button
                    key="cancel"
                    onClick={handleCancel}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    {t('Category_Cancel')}
                </button>
            </div>
            </Modal>
        </div>
    );

}