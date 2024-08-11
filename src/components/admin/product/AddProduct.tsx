import { ThemeProvider } from '@material-ui/core/styles';
import axios from "axios";
import { ChangeEventHandler, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from 'antd';
import { ICategory, IMainCategory, ISubCategory } from "../../../interfaces/Catalog/IMainCategory";
import { IImageItem } from "../../../interfaces/Product/IProduct";
import { IProductCreate } from "../../../interfaces/Product/IProductCreate";
import { APP_ENV } from "../../../env/config";
import { theme } from '../../../theme/theme';
import TextFieldComponent from '../../../ui/input-with-label/TextFieldComponent';
import PriceTextFieldNoLableComponent from '../../../ui/input-with-label/PriceTextFieldNoLableComponent';
import { useTranslation } from 'react-i18next';
import { FormControl, MenuItem, TextField } from '@material-ui/core';
import { getLocalizedField } from '../../../utils/localized/localized';
import { getColorsList, getMaterialsList, getSeasonList, getSizesList } from '../../../services/info/info-services';
import { IProductFilters } from '../../../interfaces/Info/IInfo';
import LongTextFieldComponents from '../../../ui/input-with-label/LongTextFieldComponents';
import CheckboxGroup from '../../../ui/input-with-label/CheckboxGroup';
import CategorySelect from '../../../ui/input-with-label/CategorySelect';
import SubCategorySelect from '../../../ui/input-with-label/SubCategorySelect';
import MainCategorySelect from '../../../ui/input-with-label/MainCategorySelect';
import HighlightsInput from '../../../ui/input-with-label/HighlightsInput';
import { validateForm } from '../../../validations/add-product/add-product-validations';

interface FormData {
    name: string;
    article: string;
    price: string;
    season: string;
    color: string;
    material: string;
    sizes: string[];
    mainCategory: string;
    subCategory: string;
    category: string;
    description_en: string;
    highlights_en: string[];
}

const AddProduct = () => {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;
    const baseUrl = APP_ENV.BASE_URL;
    const navigate = useNavigate();
    const [season, setSeason] = useState<IProductFilters[]>([]);
    const [colors, setColors] = useState<IProductFilters[]>([]);
    const [materials, setMaterials] = useState<IProductFilters[]>([]);
    const [sizes, setSizes] = useState<IProductFilters[]>([]);
    const [Images, setImages] = useState<IImageItem[]>([]);
    const [mainCategory, setMainCategory] = useState<IMainCategory[]>([]);
    const [subCategory, setSubCategory] = useState<ISubCategory[]>([]);
    const [categoryList, setCategoryList] = useState<ICategory[]>([]);
    const [selectedMainCategory, setSelectedMainCategory] = useState<IMainCategory | null>(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState<ISubCategory | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);

    const [formData, setFormData] = useState<FormData>({
        name: '',
        article: '',
        price: '',
        season: '',
        color: '',
        material: '',
        sizes: [],
        mainCategory: '',
        subCategory: '',
        category: '',
        description_en: '',
        highlights_en: [],
    });

    const [errors, setErrors] = useState({
        name: '',
        article: '',
        price: '',
        season: '',
        color: '',
        material: '',
        size: '',
        mainCategory: '',
        subCategory: '',
        category: '',
        description_en: '',
        highlights_en: '',
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (event: { target: { value: any; checked: any; }; }) => {
        const { value, checked } = event.target;

        setFormData((prevData) => {
            if (checked) {
                return { ...prevData, sizes: [...prevData.sizes, value] };
            } else {
                return { ...prevData, sizes: prevData.sizes.filter((size) => size !== value) };
            }
        });
    };

    const handleHighlightsChange = (highlights: string[]) => {
        setFormData((prevData) => ({
            ...prevData,
            highlights_en: highlights,
        }));
    };
    useEffect(() => {
        getSeasonList()
            .then(data => setSeason(data))
            .catch(error => console.error('Error fetching season data:', error));
        getColorsList()
            .then(data => setColors(data))
            .catch(error => console.error('Error fetching colors data:', error));
        getMaterialsList()
            .then(data => setMaterials(data))
            .catch(error => console.error('Error fetching materials data:', error));
        getSizesList()
            .then(data => setSizes(data))
            .catch(error => console.error('Error fetching sizes data:', error));



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

    const handleMainCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value as unknown as number;
        const selectedMainCat = mainCategory.find(cat => cat.id === value) || null;
        setSelectedMainCategory(selectedMainCat);
        setSelectedSubCategory(null);
        setSelectedCategory(null);
    };

    const handleSubCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value as unknown as number;
        const selectedSubCat = subCategory.find(cat => cat.id === value);
        setSelectedSubCategory(selectedSubCat || null);
        setSelectedCategory(null);
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value as unknown as number;
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
        // console.log("is select", isImage && isLt2M);
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
        navigate('/admin/product/product-list');
    }

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { isValid, newErrors } = validateForm(formData, selectedMainCategory, selectedSubCategory, selectedCategory);
        setErrors(newErrors);
        if (isValid) {
            const model: IProductCreate = {
                name_en: formData.name,
                name_uk: formData.name,
                name_es: formData.name,
                name_fr: formData.name,

                description_en: formData.description_en,
                description_uk: formData.description_en,
                description_es: formData.description_en,
                description_fr: formData.description_en,

                highlights_en: formData.highlights_en,
                highlights_uk: formData.highlights_en,
                highlights_es: formData.highlights_en,
                highlights_fr: formData.highlights_en,

                price: formData.price,
                materialId: parseInt(formData.material),
                seasonId: parseInt(formData.season),
                colorId: parseInt(formData.color),
                article: formData.article,
                ImagesFile: Images,
                CategoryId: selectedCategory?.id,
                sizes: formData.sizes,
            };

            try {
                await axios.post(`${baseUrl}/api/Product/CreateProduct`, model, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                navigate("/admin/product/product-list");
            }
            catch (ex) {
                message.error('Error adding product!');
            }
        } else {
            console.log(formData);
        }
    };

    return (
        <div className="bg-gray-100" >
            <div className="container mx-auto p-8 ">

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 bg-gray-100">
                    <div className="bg-white p-5 rounded-md shadow-md mb-8 mt-8 ">

                        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex justify-center ">
                            <div className="pb-6 mt-6">
                                <h2 className="text-base font-semibold leading-7 text-gray-900">Add Product</h2>
                            </div>
                        </div>
                        <div className="border-t">
                            <form onSubmit={onSubmit}>
                                <div className="space-y-6">
                                    <div className="border-b border-gray-900/10 pb-12">
                                        <ThemeProvider theme={theme}>
                                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                                                <div className="sm:col-span-2">
                                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                                        {t('Add_Product_Name')}
                                                    </label>
                                                    <TextFieldComponent
                                                        label=""
                                                        name="name"
                                                        id="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        error={errors.name ?? null}
                                                        autoComplete="name"
                                                        maxLength={30}
                                                    />
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <label htmlFor="article" className="block text-sm font-medium text-gray-700 mb-2">
                                                        {t('Add_Product_Article')}
                                                    </label>
                                                    <TextFieldComponent
                                                        label=""
                                                        name="article"
                                                        id="article"
                                                        value={formData.article}
                                                        onChange={handleChange}
                                                        error={errors.article ?? null}
                                                        autoComplete="article"
                                                        maxLength={30}
                                                    />
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                                        {t('Add_Product_Price')}
                                                    </label>
                                                    <PriceTextFieldNoLableComponent
                                                        label=""
                                                        name="price"
                                                        id="price"
                                                        value={formData.price}
                                                        onChange={handleChange}
                                                        error={errors.price ?? null}
                                                        autoComplete="price"
                                                        inputType={'digits'}
                                                        maxDigits={16}
                                                    />
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <label htmlFor="season" className="block text-sm font-medium text-gray-700 mb-2">
                                                        {t('Add_Product_Season')}
                                                    </label>
                                                    <FormControl fullWidth variant="outlined">
                                                        <TextField
                                                            id="season"
                                                            name="season"
                                                            select
                                                            value={formData.season}
                                                            onChange={handleChange}
                                                            error={!!errors.season}
                                                        >
                                                            {season && season.map((season, index) => (
                                                                <MenuItem key={index} value={season.id}>
                                                                    {getLocalizedField(season, 'name', lang)}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                        {errors.season ? (
                                                            <div className="h-6 text-xs text-red-500">Error: {errors.season}</div>
                                                        ) : (<div className="h-6 text-xs "> </div>)}
                                                    </FormControl>
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
                                                        {t('Add_Product_Color')}
                                                    </label>
                                                    <FormControl fullWidth variant="outlined">
                                                        <TextField
                                                            id="color"
                                                            name="color"
                                                            select
                                                            value={formData.color}
                                                            onChange={handleChange}
                                                            error={!!errors.color}
                                                        >
                                                            {colors && colors.map((color, index) => (
                                                                <MenuItem key={index} value={color.id}>
                                                                    {getLocalizedField(color, 'name', lang)}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                        {errors.color ? (
                                                            <div className="h-6 text-xs text-red-500">Error: {errors.color}</div>
                                                        ) : (<div className="h-6 text-xs "> </div>)}
                                                    </FormControl>
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <label htmlFor="material" className="block text-sm font-medium text-gray-700 mb-2">
                                                        {t('Add_Product_Material')}
                                                    </label>
                                                    <FormControl fullWidth variant="outlined">
                                                        <TextField
                                                            id="material"
                                                            name="material"
                                                            select
                                                            value={formData.material}
                                                            onChange={handleChange}
                                                            error={!!errors.material}
                                                        >
                                                            {materials && materials.map((material, index) => (
                                                                <MenuItem key={index} value={material.id}>
                                                                    {getLocalizedField(material, 'name', lang)}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                        {errors.material ? (
                                                            <div className="h-6 text-xs text-red-500">Error: {errors.material}</div>
                                                        ) : (<div className="h-6 text-xs "> </div>)}
                                                    </FormControl>
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <label htmlFor="mainCategoryId" className="block text-sm font-medium text-gray-700 mb-2">
                                                        {t('Add_Product_MainCategory')}
                                                    </label>
                                                    <MainCategorySelect
                                                        mainCategory={mainCategory}
                                                        selectedMainCategory={selectedMainCategory}
                                                        handleMainCategoryChange={handleMainCategoryChange}
                                                        errors={errors}
                                                        lang={lang}
                                                    />
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <label htmlFor="subCategoryId" className="block text-sm font-medium text-gray-700 mb-2">
                                                        {t('Add_Product_SubCategory')}
                                                    </label>
                                                    <SubCategorySelect
                                                        subCategory={subCategory}
                                                        selectedSubCategory={selectedSubCategory}
                                                        selectedMainCategory={selectedMainCategory}
                                                        handleSubCategoryChange={handleSubCategoryChange}
                                                        errors={errors}
                                                        lang={lang}
                                                    />
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <label htmlFor="CategoryId" className="block text-sm font-medium text-gray-700 mb-2">
                                                        {t('Add_Product_Category')}
                                                    </label>
                                                    <CategorySelect
                                                        categoryList={categoryList}
                                                        selectedCategory={selectedCategory}
                                                        selectedSubCategory={selectedSubCategory}
                                                        handleCategoryChange={handleCategoryChange}
                                                        errors={errors}
                                                        lang={lang}
                                                    />
                                                </div>

                                                <div className="sm:col-span-6">
                                                    <label htmlFor="sizes" className="block text-sm font-medium text-gray-700 mb-2 mt-4">
                                                        {t('Add_Product_Sizes')}
                                                    </label>
                                                    <CheckboxGroup
                                                        sizes={sizes}
                                                        handleCheckboxChange={handleCheckboxChange}
                                                        lang={lang}
                                                        error={errors.size ?? null}
                                                    />
                                                </div>

                                                <div className="col-span-full">
                                                    <label htmlFor="description_en" className="block text-sm font-medium text-gray-700 mb-2">
                                                        {t('Add_Product_Description')}
                                                    </label>
                                                    <LongTextFieldComponents
                                                        label=""
                                                        name="description_en"
                                                        id="description_en"
                                                        value={formData.description_en}
                                                        onChange={handleChange}
                                                        error={errors.description_en ?? null}
                                                        autoComplete="description_en"
                                                    />
                                                </div>

                                                <div className="col-span-full">
                                                    <HighlightsInput
                                                        highlights={formData.highlights_en}
                                                        setHighlights={handleHighlightsChange}
                                                        error={errors.highlights_en}
                                                    />
                                                </div>
                                            </div>
                                        </ThemeProvider>

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
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
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
                                        className="p-2 mr-3 flex items-center justify-center rounded-md border bg-indigo-600 hover:bg-indigo-700 px-8 py-2 text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                            {/* </Form> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}
export default AddProduct;