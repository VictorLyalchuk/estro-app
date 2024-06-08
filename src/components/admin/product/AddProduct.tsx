import axios from "axios";
import { ChangeEventHandler, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Select, message } from 'antd';
import TextArea from "antd/es/input/TextArea";
import { ICategory, IMainCategory, ISubCategory } from "../../../interfaces/Catalog/IMainCategory";
import { IImageItem } from "../../../interfaces/Catalog/IProduct";
import { IProductCreate } from "../../../interfaces/Catalog/IProductCreate";
import { APP_ENV } from "../../../env/config";

const AddProduct = () => {
    const baseUrl = APP_ENV.BASE_URL;
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [Images, setImages] = useState<IImageItem[]>([]);
    const [mainCategory, setMainCategory] = useState<IMainCategory[]>([]);
    const [subCategory, setSubCategory] = useState<ISubCategory[]>([]);
    const [categoryList, setCategoryList] = useState<ICategory[]>([]);
    const [selectedMainCategory, setSelectedMainCategory] = useState<IMainCategory>();
    const [selectedSubCategory, setSelectedSubCategory] = useState<ISubCategory | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);

    useEffect(() => {
        axios.get<ICategory[]>(`${baseUrl}/api/CategoryControllers/CategoryGetAsync`)
            .then((resp) => {
                setCategoryList(resp.data);
            });

        axios.get<ISubCategory[]>(`${baseUrl}/api/CategoryControllers/SubCategoryGetAsync`)
            .then((respos) => {
                setSubCategory(respos.data);
            });
        axios.get<IMainCategory[]>(`${baseUrl}/api/CategoryControllers/MainCategoryGetAsync`)
            .then((respos) => {
                setMainCategory(respos.data);
            });
    }, []);

    const handleMainCategoryChange = (value: number) => {
        const selectedMainCat = mainCategory.find(cat => cat.id === value);
        setSelectedMainCategory(selectedMainCat);
        setSelectedSubCategory(null);
        setSelectedCategory(null);
        form.setFieldsValue({
            subCategoryId: null,
            CategoryId: null,
        });
    };

    const handleSubCategoryChange = (value: number) => {
        const selectedSubCat = subCategory.find(cat => cat.id === value);
        setSelectedSubCategory(selectedSubCat || null);
        setSelectedCategory(null);
        form.setFieldsValue({
            CategoryId: null,
        });
    };

    const handleCategoryChange = (value: number) => {
        const selectedCat = categoryList.find(cat => cat.id === value);
        setSelectedCategory(selectedCat || null);
    };

    const beforeUpload = (file: File) => {
        const isImage = /^image\/\w+/.test(file.type);
        if (!isImage) {
            message.error('Оберіть файл зображення!');
        }
        const isLt2M = file.size / 1200 / 1200 < 10;
        if (!isLt2M) {
            message.error('Розмір файлу не повинен перевищувать 10MB!');
        }
        console.log("is select", isImage && isLt2M);
        return isImage && isLt2M;
    };

    const handleFileChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
        const files = e.target.files;

        if (!files || files.length === 0) {
            return;
        }
        const file = files[0];
        if (!beforeUpload(file)) {
            return;
        }
        const formData = new FormData();
        formData.append('ImageFile', file);

        try {
            const response = await axios.post(`${baseUrl}/api/Image/CreateImage`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setImages((prevPaths) => [...prevPaths, response.data]);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const handleRemove = async (ImagePath: string, e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const currentImage = Images.find((image) => image.imagePath === ImagePath);

        if (currentImage) {

            const newImages = Images.filter((image) => image.imagePath !== ImagePath);
            setImages(newImages);

            const model: IImageItem = {
                id: currentImage.id,
                imagePath: ImagePath
            }
            try {
                await axios.post(`${baseUrl}/api/Image/DeleteImage`, model, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        };
    };

    const handleCancel = () => {
        navigate('/dashBoard/tables');
    }

    const onSubmit = async (values: any) => {
        if (Images == null) {
            message.error("Choose your photo!");
            return;
        }
        const model: IProductCreate = {
            name: values.name,
            description: values.description,
            price: values.price,
            material: values.material,
            purpose: values.purpose,
            color: values.color,
            article: values.article,
            ImagesFile: Images,
            CategoryId: values.CategoryId,
            storageId: values.storageId || null,
        };
        // console.log("Send model files:", model);

        try {
            await axios.post(`${baseUrl}/api/Product/CreateProduct`, model, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            navigate("/dashBoard/tables");
        }
        catch (ex) {
            message.error('Error adding product!');
        }
    };

    const onSubmitFailed = (errorInfo: any) => {
        console.log("Error Form data", errorInfo);
    }

    return (
        <div className="bg-gray-100" >
            <div className=" sm:mx-auto sm:w-full sm:max-w-sm flex justify-center bg-gray-100">
                <div className=" pb-6 mt-6">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Add Product</h2>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 bg-gray-100">
                <div className="border-b border-gray-200">
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 bg-gray-100">
                <Form
                    form={form}
                    encType="multipart/form-data"
                    initialValues={{ remember: true }}
                    onFinish={onSubmit}
                    onFinishFailed={onSubmitFailed}
                >
                    <div className="space-y-6">
                        <div className="border-b border-gray-900/10 pb-12">
                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                                <div className="sm:col-span-2">
                                    <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                        Name
                                    </label>
                                    <Form.Item
                                        name="name"
                                        htmlFor="name"
                                        noStyle>
                                        <Input
                                            id="name"
                                            name="name"
                                            type="name"
                                            autoComplete="name"
                                            placeholder="Enter name"
                                            required

                                        // className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </Form.Item>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="article" className="block text-sm font-medium leading-6 text-gray-900">
                                        Article
                                    </label>
                                    <Form.Item
                                        name="article"
                                        htmlFor="article"
                                        noStyle>
                                        <Input
                                            id="article"
                                            name="article"
                                            type="text"
                                            autoComplete="article"
                                            placeholder="Enter article"
                                            required

                                        // className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </Form.Item >
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
                                        Price
                                    </label>
                                    <Form.Item
                                        name="price"
                                        htmlFor="price"
                                        noStyle
                                    >
                                        <Input
                                            id="price"
                                            name="price"
                                            type="number"
                                            autoComplete="price"
                                            placeholder="0.00"
                                            addonBefore="₴"
                                            required
                                        // className="w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </Form.Item>
                                </div>


                                <div className="sm:col-span-2">
                                    <label htmlFor="purpose" className="block text-sm font-medium leading-6 text-gray-900">
                                        Purpose
                                    </label>
                                    <Form.Item
                                        name="purpose"
                                        htmlFor="purpose"
                                        noStyle>
                                        <Select 
                                            id="purpose"
                                            className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            options={[
                                                { value: 'Winter', label: 'Winter' },
                                                { value: 'Spring', label: 'Spring' },
                                                { value: 'Summer', label: 'Summer' },
                                                { value: 'Autumn', label: 'Autumn' },
                                            ]}
                                            />
                                    </Form.Item>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="color" className="block text-sm font-medium leading-6 text-gray-900">
                                        Color
                                    </label>
                                    <Form.Item
                                        name="color"
                                        htmlFor="color"
                                        noStyle>
                                        <Select
                                            id="color"
                                            // defaultValue="Black"
                                            className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            options={[
                                                { value: 'Black', label: 'Black' },
                                                { value: 'Brown', label: 'Brown' },
                                                { value: 'Gray', label: 'Gray' },
                                                { value: 'Light Gray', label: 'Light Gray' },
                                                { value: 'White', label: 'White' },
                                                { value: 'Milk', label: 'Milk' },
                                                { value: 'Navy', label: 'Navy' },
                                                { value: 'Blue', label: 'Blue' },
                                                { value: 'Beige', label: 'Beige' },
                                                { value: 'Red', label: 'Red' },
                                                { value: 'Burgundy', label: 'Burgundy' },
                                            ]}
                                        />
                                    </Form.Item>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="material" className="block text-sm font-medium leading-6 text-gray-900">
                                        Material
                                    </label>
                                    <Form.Item
                                        name="material"
                                        htmlFor="material"
                                        noStyle>
                                        <Select
                                            id="material"
                                            // defaultValue="Leather"
                                            className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            options={[
                                                { value: 'Leather', label: 'Leather' },
                                                { value: 'Suede', label: 'Suede' },
                                                { value: 'Nubuck', label: 'Nubuck' },
                                                { value: 'Textile', label: 'Textile' },
                                                { value: 'Synthetic', label: 'Synthetic' },
                                            ]}
                                        />
                                    </Form.Item>
                                </div>





                                <div className="sm:col-span-2">
                                    <label htmlFor="mainCategoryId" className="block text-sm font-medium leading-6 text-gray-900">
                                        Main Category
                                    </label>
                                    <Form.Item name="mainCategoryId" htmlFor="mainCategoryId" noStyle>
                                        <Select
                                            id="mainCategoryId"
                                            className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"

                                            value={selectedMainCategory?.id ?? null}
                                            onChange={handleMainCategoryChange}
                                        >
                                            {mainCategory.map((mainCategory) => (
                                                <Select.Option key={mainCategory.id} value={mainCategory.id}>
                                                    {mainCategory.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="subCategoryId" className="block text-sm font-medium leading-6 text-gray-900">
                                        Sub Category
                                    </label>
                                    <Form.Item name="subCategoryId" htmlFor="subCategoryId" noStyle>
                                        <Select
                                            id="subCategoryId"
                                            className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"

                                            value={selectedSubCategory?.id ?? null}
                                            onChange={handleSubCategoryChange}
                                        >
                                            {subCategory
                                                .filter((subCat) => !selectedMainCategory || selectedMainCategory?.id === subCat.mainCategoryId)
                                                .map((subCat) => (
                                                    <Select.Option key={subCat.id} value={subCat.id}>
                                                        {subCat.name}
                                                    </Select.Option>
                                                ))}
                                        </Select>
                                    </Form.Item>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="CategoryId" className="block text-sm font-medium leading-6 text-gray-900">
                                        Category
                                    </label>
                                    <Form.Item name="CategoryId" htmlFor="CategoryId" noStyle>
                                        <Select
                                            id="CategoryId"
                                            value={selectedCategory?.id ?? null}

                                            className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            onChange={handleCategoryChange}
                                        >
                                            {categoryList
                                                .filter((cat) => !selectedSubCategory || selectedSubCategory?.id === cat.subCategoryId)
                                                .map((category) => (
                                                    <Select.Option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </Select.Option>
                                                ))}
                                        </Select>
                                    </Form.Item>
                                </div>


                                {/* <div className="sm:col-span-2">
                                    <label htmlFor="CategoryId" className="block text-sm font-medium leading-6 text-gray-900">
                                        Category
                                    </label>
                                    <Form.Item
                                        name="CategoryId"
                                        htmlFor="CategoryId"
                                        noStyle>
                                        <Select
                                            id="CategoryId"
                                            className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            options={categoryList.map(option => ({ value: option.id, label: option.name }))}
                                        />
                                    </Form.Item>
                                </div> */}

                                <div className="col-span-full">
                                    <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                                        Description
                                    </label>
                                    <Form.Item className="mt-2"
                                        name="description"
                                        htmlFor="description"
                                        noStyle>
                                        <TextArea
                                            id="description"
                                            name="description"
                                            rows={7}
                                        // className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                        </div>

                        <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                            Cover photo
                        </label>
                        <div className="relative mb-5.5 block w-full appearance-none rounded rounded-lg border border-dashed border-gray-900/25 bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5">

                            {Images && Images.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {Images.map((image, index) => (
                                        <div className="relative bg-white dark:bg-boxdark rounded-lg overflow-hidden shadow-md">
                                            <img
                                                key={index}
                                                src={`http://localhost:5169/uploads/1200_${image.imagePath}`}
                                                alt="uploaded"
                                                className="w-full h-auto"
                                            />
                                            <button
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 cursor-pointer flex items-center justify-center"
                                                onClick={(e) => handleRemove(image.imagePath, e)}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    className="h-6 w-6"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center space-y-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                                                fill="#3C50E0"
                                            />
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                                                fill="#3C50E0"
                                            />
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                                                fill="#3C50E0"
                                            />
                                        </svg>
                                    </span>
                                </div>
                            )}
                            <div className="flex flex-col items-center justify-center space-y-3">

                                <div className="mt-2 flex justify-center rounded-lg ">
                                    <div className="mt-4 flex text-sm leading-6 text-gray-600 ">
                                        <label
                                            className="relative rounded-md bg-gray-100 font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                        >
                                            <input
                                                onChange={handleFileChange}
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                                            />
                                            <p className="cursor-pointer">Upload a file</p>
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                </div>
                                <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF, WEBP up to 10MB</p>
                                <p className="text-xs text-gray-600">(max, 1200 X 1200px)</p>
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
        </div>

    );
}
export default AddProduct;