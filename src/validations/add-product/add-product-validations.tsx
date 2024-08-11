import { ICategory, IMainCategory, ISubCategory } from "../../interfaces/Catalog/IMainCategory";

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

interface Errors {
    name: string;
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
    highlights_en: string; 
}

export const validateForm = (formData: FormData, selectedMainCategory: IMainCategory | null, selectedSubCategory: ISubCategory | null, selectedCategory: ICategory | null): { isValid: boolean; newErrors: Errors } => {
    let isValid = true;
    const newErrors: Errors = {
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
    };

    if (formData.name.trim() === '') {
        newErrors.name = 'Name is required';
        isValid = false;
    }

    if (formData.article.trim() === '') {
        newErrors.article = 'Article is required';
        isValid = false;
    }

    if (formData.price.trim() === '') {
        newErrors.price = 'Price is required';
        isValid = false;
    }

    if (formData.season === '') {
        newErrors.season = 'Season is required';
        isValid = false;
    }

    if (formData.color === '') {
        newErrors.color = 'Color is required';
        isValid = false;
    }

    if (formData.material === '') {
        newErrors.material = 'Material is required';
        isValid = false;
    }

    if (formData.sizes.length === 0) {
        newErrors.size = 'At least one size is required';
        isValid = false;
    }

    if (selectedMainCategory === null) {
        newErrors.mainCategory = 'Main Category is required';
        isValid = false;
    }

    if (selectedSubCategory === null) {
        newErrors.subCategory = 'Sub Category is required';
        isValid = false;
    }

    if (selectedCategory === null) {
        newErrors.category = 'Category is required';
        isValid = false;
    }

    if (formData.description_en.trim() === '') {
        newErrors.description_en = 'Description is required';
        isValid = false;
    }

    if (formData.highlights_en.length === 0) {
        newErrors.highlights_en = 'At least one highlights is required';
        isValid = false;
    }
    else if (formData.highlights_en[0]  === '') {
        newErrors.highlights_en = 'Highlights is required';
        isValid = false;
    }
    return { isValid, newErrors };
};