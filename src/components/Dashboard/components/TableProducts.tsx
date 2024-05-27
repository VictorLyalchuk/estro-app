import { useEffect, useState } from 'react';
import { IProduct } from '../../../interfaces/Site/IProduct';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ProductReducerActionType } from '../../../store/product/productReducer';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'antd';
import { PaginationReducerActionType } from '../pages/TableProductsReducer';
import {APP_ENV} from "../../../env/config";

const TableTwo = () => {
    const baseUrl = APP_ENV.BASE_URL;
    const dispatch = useDispatch();
    const page = useSelector((state: { paginationProdDashboard: { currentPage: number | null } }) => state.paginationProdDashboard.currentPage);
    const productList = useSelector((state: { products: { products: IProduct[] } }) => state.products.products) || [];
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [SelectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

    useEffect(() => {
        axios.get<IProduct[]>(`${baseUrl}/api/Product/ProductByPage/${page}`)
            .then(resp => {
                // setProduct(resp.data);
                dispatch({
                    type: ProductReducerActionType.SET,
                    payload: {
                        products: resp.data
                    }
                });
            });
        axios.get<number>(`${baseUrl}/api/Product/ProductQuantity`)
            .then(resp => {
                dispatch({
                    type: PaginationReducerActionType.TOTAL_PRODUCTS,
                    payload: {
                        totalProducts: resp.data
                    }
                });
            });
    }, [dispatch, page]);


    const showDeleteConfirm = (product: IProduct) => {
        setSelectedProduct(product);
        setModalVisible(true);
    };

    const handleDeleteProduct = () => {
        axios.delete(`${baseUrl}/api/Product/DeleteProductByID/${SelectedProduct?.id}`)
            .then(() => {
                dispatch({
                    type: ProductReducerActionType.DELETE,
                    payload: {
                        productId: SelectedProduct?.id
                    }
                });
                dispatch({
                    type: PaginationReducerActionType.PRODUCTS_DECREASE,
                    payload: {

                    }
                });
            })
            .catch(error => {
                console.error('Error deleting product:', error);
            });
        setModalVisible(false);
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    return (
        <>
            <div className="rounded-sm border border-stroke bg-gray-100 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="py-6 px-4 md:px-6 xl:px-7.5 bg-gray-100">
                    <h4 className="text-xl font-semibold text-black dark:text-white">
                        Products
                    </h4>
                </div>

                <div className="grid grid-cols-7 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-11 md:px-6 2xl:px-7.5">

                    <div className="col-span-1 hidden items-center sm:flex">
                        <p className="font-bold">Id</p>
                    </div>
                    <div className="col-span-3 flex items-center">
                        <p className="font-bold">Product Name</p>
                    </div>
                    <div className="col-span-1 hidden items-center sm:flex">
                        <p className="font-bold">Article</p>
                    </div>
                    <div className="col-span-2 hidden items-center sm:flex">
                        <p className="font-bold">Category</p>
                    </div>
                    <div className="col-span-1 flex items-center">
                        <p className="font-bold">Price</p>
                    </div>
                    <div className="col-span-1 flex items-center">
                        <p className="font-bold">Size</p>
                    </div>
                    <div className="col-span-1 flex items-center">
                        <p className="font-bold">Count</p>
                    </div>
                    <div className="col-span-1 flex items-center">
                        <p className="font-bold">Actions</p>
                    </div>
                </div>

                {productList.map((product) => (
                    <>
                        <div className="grid grid-cols-7 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-11 md:px-6 2xl:px-7.5 hover:bg-indigo-500 hover:text-white">
                            <div className="col-span-1 hidden items-center sm:flex">
                                <p className="text-sm dark:text-white ">{product.id}</p>
                            </div>
                            <div className="col-span-3 flex items-center">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                                    <div className=" w-25 rounded-md mr-6">
                                        <img src={`${baseUrl}/uploads/1200_${product.images?.[0]?.imagePath || '/uploads/default.jpg'}`} alt="Product" />
                                    </div>
                                </div>
                                    <p className="text-sm dark:text-white">{product.name}</p>
                            </div>
                            <div className="col-span-1 hidden items-center sm:flex">
                                <p className="text-sm ">{product.article}</p>
                            </div>
                            <div className="col-span-2 hidden items-center sm:flex">
                                <p className="text-sm dark:text-white">{product.categoryName}</p>
                            </div>
                            <div className="col-span-1 flex items-center">
                                <p className="text-sm dark:text-white">{product.price} ₴</p>
                            </div>

                            <div className="col-span-1">
                                {product.storages?.map((storage, index) => (
                                    <p key={index} className="text-sm dark:text-white mb-2">
                                        {`${storage.size}`}
                                    </p>
                                ))}
                            </div>
                            <div className="col-span-1">
                                {product.storages?.map((storage, index) => (
                                    <p key={index} className="text-sm  dark:text-white mb-2">
                                        {`${storage.productQuantity}`}
                                    </p>
                                ))}
                            </div>


                            <div className="col-span-1 flex flex-col items-center justify-center hover:text-white">
                                <Link to={`/product/${product.id}`} className="text-sm text-black dark:text-white mb-2 hover:text-white">Product Info
                                </Link>
                                <Link to={"/admin/add-product"} className="text-sm text-black dark:text-white mb-2 hover:text-white">Add Product
                                </Link>
                                <Link to={`/admin/add-storage/${product.id}`} className="text-sm text-black dark:text-white mb-2 hover:text-white">Add Storage
                                </Link>
                                <Link to={`/admin/edit-product/${product.id}`} className="text-sm text-black dark:text-white mb-2 hover:text-white">Edit Product
                                </Link>
                                <button className="text-sm text-black dark:text-white mb-2 hover:text-white"
                                    // onClick={() => handleDeleteProduct(product.id)}>
                                    onClick={() => showDeleteConfirm(product)}>
                                    Delete Product
                                </button>
                            </div>
                        </div>
                    </>
                ))}
            </div>
            <Modal
                title="Delete Category"
                visible={modalVisible}
                onOk={handleDeleteProduct}
                onCancel={handleCancel}
                okText="Delete"
                cancelText="Cancel"
                className="custom-modal"
            >
                <p>Are you sure you want to delete this product?</p>
            </Modal>
        </>

    );
};

export default TableTwo;