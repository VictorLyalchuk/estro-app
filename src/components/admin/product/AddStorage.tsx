import { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { IProduct, IStorages } from '../../../interfaces/Product/IProduct';
import { Form, Input, message } from 'antd';
import axios from 'axios';
import {APP_ENV} from "../../../env/config";

export default function Product() {
    const baseUrl = APP_ENV.BASE_URL;
    const { Id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<IProduct>();
    const [storagesList, setStorages] = useState<IStorages[]>([]);
    const [form] = Form.useForm();

    const handleCancel = () => {
        navigate('/dashBoard/tables');
    }
    useEffect(() => {
        axios.get<IProduct>(`${baseUrl}/api/Product/ProductByID/${Id}`)
            .then(resp => {
                setProduct(resp.data);

            const updatedStoragesList = resp.data?.storages?.map(storage => ({
                id: storage.id,
                size: storage.size,
                productQuantity: 0, 
                productId: resp.data.id,
                inStock: storage.inStock,
            })) || [];
            setStorages(updatedStoragesList);

            form.setFieldsValue({
                id: resp.data.id,
                name: resp.data?.name,
                storages: updatedStoragesList, 
            });
        });
}, [Id]);
    
    if (!product) {
        return <p></p>
    }
    const onStorageQuantityChange = (storageId: number, quantity: number) => {
        setStorages(prevStorages => {
          const updatedStorages = prevStorages.map(storage => {
            if (storage.id === storageId) {
              return {
                ...storage,
                productQuantity: quantity,
              };
            }
            return storage;
          });
          return updatedStorages;
        });
      };

    const onSubmit = async () => {
        console.log("Send model files:", storagesList);

          try {
            await axios.post(`${baseUrl}/api/StorageControllers/AddQuantityStorage`, storagesList, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            navigate('/dashBoard/tables');
        }
        catch (ex) {
            message.error('Error editing product!');
        }
    };

    return (
        <div className="overflow-hidden rounded-sm border-stroke bg-gray-100 shadow-default dark:border-strokedark dark:bg-boxdark text-body" style={{ minHeight: '900px' }}>
            <div className="pt-6 mb-6">
                <nav aria-label="Breadcrumb" >
                    <ol role="list" className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                        <li className="text-sm  border-r ">
                            <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
                                <div className="mt-9 lg:row-span-3 lg:mt-0 lg:col-start-3">
                                    <div className="w-50 rounded-md">
                                        <img src={`http://localhost:5169/uploads/1200_${product.images?.[0]?.imagePath || '/uploads/default.jpg'}`} alt="Product" />
                                    </div>

                                    <div className="mt-8">
                                        <h3 className="text-1xl text-gray-900">Name: {product.name}</h3>
                                    </div>
                                    <div className="mt-4">
                                        <h3 className="text-1xl text-gray-900">Price: {product.price} ₴</h3>
                                    </div>
                                    <div className="mt-4">
                                        <h3 className="text-1xl text-gray-900">Article: {product.article}</h3>
                                    </div>
                                    <div className="mt-4">
                                        <h3 className="text-1xl text-gray-900">Color: {product.color}</h3>
                                    </div>
                                    <div className="mt-4">
                                        <h3 className="text-1xl text-gray-900">Material: {product.material}</h3>
                                    </div>
                                    <div className="mt-4">
                                        <h3 className="text-1xl text-gray-900">Period: {product.purpose}</h3>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className="text-sm flex items-center justify-center">
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                <Form
                                    form={form}
                                    encType="multipart/form-data"
                                    onFinish={onSubmit}
                                    initialValues={{ remember: true }}
                                >
                                    <div className="space-y-6">
                                        <div className="border-b border-gray-900/10 pb-12">
                                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                                                <div className={Id ? "sm:col-span-2 hidden" : "sm:col-span-2"}>
                                                    <label htmlFor="id" className="block text-sm font-medium leading-6 text-gray-900">
                                                        id
                                                    </label>
                                                    <Form.Item
                                                        name="id"
                                                        htmlFor="id"
                                                        noStyle>
                                                        <Input
                                                            id="id"
                                                            name="id"
                                                            type="id"
                                                            autoComplete="id"
                                                            className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        />
                                                    </Form.Item>
                                                </div>



                                                {product.storages?.map((storage, index) => (
                                                    <div key={index} className="sm:col-span-2 flex flex-col items-center">
                                                        <label htmlFor={`quantity-${index}`} className="block text-sm font-medium leading-6 text-gray-900">
                                                            {storage.size}
                                                        </label>
                                                        <Form.Item
                                                            name={`${storage.id}`}
                                                            htmlFor={`${storage.id}`}
                                                            noStyle
                                                        >
                                                            <Input
                                                                id={`${storage.id}`}
                                                                name={`${storage.id}`}
                                                                type="number"
                                                                autoComplete="name"
                                                                placeholder="Enter quantity"
                                                                min="0"
                                                                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                onChange={(e) => {
                                                                    const quantity = parseInt(e.target.value, 10);
                                                                    onStorageQuantityChange(storage.id, quantity);
                                                                  }}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-end gap-x-6">
                                        <button type="button" className="text-sm font-semibold leading-6 text-gray-900" onClick={handleCancel}>
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </Form>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>
        </div>
    )
}
