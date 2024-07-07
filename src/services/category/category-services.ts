import axios from "axios";
import { APP_ENV } from "../../env/config";

import { ICategory, IMainCategory, ISubCategory } from "../../interfaces/Catalog/IMainCategory";

const baseUrl = APP_ENV.BASE_URL;

// Створюємо екземпляр axios
const instance = axios.create({
    baseURL: `${baseUrl}/api/CategoryControllers`,
    headers: {
        "Content-Type": "application/json"
    }
});

export async function getMainCategories() {
    try {
        const response = await instance.get<IMainCategory[]>(`/MainCategoryGetAsync`);
        return response.data.map((mainCategory: IMainCategory) => ({
            id: mainCategory.id,
            name_en: mainCategory.name_en,
            name_es: mainCategory.name_es,
            name_fr: mainCategory.name_fr,
            name_uk: mainCategory.name_uk,
            description: mainCategory.description,
            imagePath: mainCategory.imagePath,
            urlName: mainCategory.urlName,
            subCategories: mainCategory.subCategories?.map((subCategory: ISubCategory) => ({
                id: subCategory.id,
                name_en: subCategory.name_en,
                name_es: subCategory.name_es,
                name_fr: subCategory.name_fr,
                name_uk: subCategory.name_uk,
                description: subCategory.description,
                imagePath: subCategory.imagePath,
                mainCategoryId: subCategory.mainCategoryId,
                urlName: subCategory.urlName,
                categories: subCategory.categories?.map((category: ICategory) => ({
                    id: category.id,
                    name_en: category.name_en,
                    name_es: category.name_es,
                    name_fr: category.name_fr,
                    name_uk: category.name_uk,
                    description: category.description,
                    imagePath: category.imagePath,
                    subCategoryId: category.subCategoryId,
                    urlName: category.urlName,
                })) || [],
            })) || [],
        }));
    } catch (error) {
        console.error('Failed to fetch main categories:', error);
        throw error;
    }
}

export async function getCategoryList(subName: string) {
    try {
        const resp = await instance.get<ICategory[]>(`CategoryGetWithSub`, {
            params: { subName }
        });
        return resp.data;
    } catch (error) {
        console.error('Failed to fetch product data:', error);
        throw error;
    }
}