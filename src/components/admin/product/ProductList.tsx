import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { IProduct } from '../../../interfaces/Product/IProduct';
import axios from 'axios';
import { ProductReducerActionType } from '../../../store/product/productReducer';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'antd';
import { APP_ENV } from "../../../env/config";


export default function ProductList() {
    const baseUrl = APP_ENV.BASE_URL;
    const dispatch = useDispatch();
    const productList = useSelector((state: { products: { products: IProduct[] } }) => state.products.products) || [];
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [SelectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

    useEffect(() => {
        axios.get<IProduct[]>(`${baseUrl}/api/Product/ProductByPage/${1}`)
            .then(resp => {
                // setProduct(resp.data);
                dispatch({
                    type: ProductReducerActionType.SET,
                    payload: {
                        products: resp.data
                    }
                });
            });
    }, [dispatch]);


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
        <div className="bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h2 className="px-4 text-base font-semibold leading-7 text-gray-900 sm:px-6 lg:px-8">Products</h2>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <Link to={"/admin/product/add-product"}
                        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Create Product
                    </Link>
                </div>
            </div>

            <div className="-mx-4 mt-10 ring-1 ring-gray-200 sm:mx-0 sm:rounded-lg">
                <table className="mt-6 w-full whitespace-nowrap text-left">
                    <colgroup>
                        <col className="lg:w-1/12" />
                        <col className="lg:w-3/12" />
                        <col className="lg:w-1/12" />
                        <col className="lg:w-1/12" />
                        <col className="lg:w-1/12" />
                        <col className="lg:w-1/12" />
                        <col className="lg:w-1/12" />
                        <col className="lg:w-1/12" />
                    </colgroup>
                    <thead className="border-b border-white/10 text-sm leading-6 text-gray-900">
                        <tr>
                            <th scope="col" className="py-2 pl-8 pr-8 font-semibold sm:table-cell">
                                Id
                            </th>
                            <th scope="col" className="py-2 pl-8 pr-8 font-semibold sm:table-cell">
                                Product Name
                            </th>
                            <th scope="col" className="py-2 pl-8 pr-4 font-semibold sm:pr-8 sm:text-left lg:pr-20">
                                Article
                            </th>
                            <th scope="col" className="py-2 pl-8 pr-8 font-semibold sm:table-cell lg:pr-20">
                                Category
                            </th>
                            <th scope="col" className="py-2 pl-8 pr-4 font-semibold sm:table-cell sm:pr-6 lg:pr-8">
                                Price
                            </th>
                            <th scope="col" className="py-2 pl-8 pr-4 font-semibold sm:table-cell sm:pr-6 lg:pr-8">
                                Size
                            </th>
                            <th scope="col" className="py-2 pl-8 pr-4 font-semibold sm:table-cell sm:pr-6 lg:pr-8">
                                Count
                            </th>
                            <th scope="col" className="py-2 pl-8 pr-4 font-semibold sm:table-cell sm:pr-6 lg:pr-8">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {productList.map((product) => (
                            <tr key={product.id} className="text-gray-700 hover:bg-gray-200 divide-x divide-gray-200 hover:divide-gray-100">
                                <td className="py-4 pl-8 pr-4 sm:table-cell sm:pr-8 border-t border-gray-200 hover:border-gray-100">
                                    <div className="font-mono text-sm leading-6">{product.id}</div>
                                </td>
                                <td className="py-4 pl-8 pr-4 sm:table-cell sm:pr-8 border-t border-gray-200">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                        <img src={`${baseUrl}/uploads/1200_${product.images?.[0]?.imagePath || '/uploads/default.jpg'}`} alt="" className="w-30 rounded-lg" />
                                        <Link to={`/product/${product.id}`} className="hover:text-indigo-500">
                                            <div className="font-mono text-sm leading-6">{product.name_en}</div>
                                        </Link>
                                    </div>
                                </td>
                                <td className="py-4 pl-8 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20 border-t border-gray-200">
                                    {product.article}
                                </td>
                                <td className="py-4 pl-8 pr-8 text-sm leading-6 sm:table-cell lg:pr-20 border-t border-gray-200">
                                    {product.categoryName_en}
                                </td>
                                <td className="py-4 pl-8 pr-8 text-sm leading-6 md:table-cell lg:pr-20 border-t border-gray-200">
                                    {product.price}
                                </td>
                                <td className="py-4 pl-8 pr-8 text-sm leading-6 md:table-cell lg:pr-20 border-t border-gray-200">
                                    <div className="col-span-1">
                                        {product.storages?.map((storage, index) => (
                                            <p key={index} className="text-sm mb-2">
                                                {`${storage.size}`}
                                            </p>
                                        ))}
                                    </div>
                                </td>
                                <td className="py-4 pl-8 pr-8 text-sm leading-6 md:table-cell lg:pr-20 border-t border-gray-200">
                                    <div className="col-span-1">
                                        {product.storages?.map((storage, index) => (
                                            <p key={index} className="text-sm mb-2">
                                                {`${storage.productQuantity}`}
                                            </p>
                                        ))}
                                    </div>
                                </td>
                                <td className="py-4 pl-8 pr-4 text-right text-sm leading-6 sm:table-cell sm:pr-6 lg:pr-8 border-t border-gray-200">
                                    <Link to={`/admin/product/add-storage/${product.id}`} className="mb-2 block mx-auto w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                        Add Storage
                                    </Link>
                                    <Link to={`/admin/product/edit-product/${product.id}`} className="mb-2 block mx-auto w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                        Edit Product
                                    </Link>
                                    <button className="block mx-auto w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        onClick={() => showDeleteConfirm(product)}>
                                        Delete Product
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
        </div>
    );

}