import { ChangeEventHandler } from "react";
import { ICategory, IMainCategory, ISubCategory } from "../Catalog/IMainCategory";
import { IProductFilters } from "../Info/IInfo";
import { IAddProductData } from "./IAddProductData";
import { IImageItem } from "./IProduct";

export interface AddProductProps {
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    formData: IAddProductData;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    errors: {
        name_en: string;
        name_uk: string;
        name_es: string;
        name_fr: string;
        article: string;
        price: string;
        season: string;
        color: string;
        material: string;
        size: string;
        mainCategory: string;
        subCategory: string;
        category: string;
        description_en: string;
        description_uk: string;
        description_es: string;
        description_fr: string;
        highlights_en: string;
        highlights_uk: string;
        highlights_es: string;
        highlights_fr: string;
    };
    season: IProductFilters[];
    colors: IProductFilters[];
    materials: IProductFilters[];
    sizes: IProductFilters[];
    Images: IImageItem[];
    mainCategory: IMainCategory[];
    subCategory: ISubCategory[];
    categoryList: ICategory[];
    selectedMainCategory: IMainCategory | null;
    selectedSubCategory: ISubCategory | null;
    selectedCategory: ICategory | null;

    handleMainCategoryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubCategoryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleCategoryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleHighlightsChange: (name: string, highlights: string[]) => void;
    handleCheckboxChange: (event: { target: { value: any; checked: any; }; }) => void;
    handleFileChange: ChangeEventHandler<HTMLInputElement>;
    handleRemove: (ImagePath: string, e: React.MouseEvent<HTMLButtonElement>) => void;
    handleCancel: () => void;
    isUploading: boolean;
}