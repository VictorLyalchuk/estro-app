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
            name: mainCategory.name,
            description: mainCategory.description,
            imagePath: mainCategory.imagePath,
            subCategories: mainCategory.subCategories?.map((subCategory: ISubCategory) => ({
                id: subCategory.id,
                name: subCategory.name,
                description: subCategory.description,
                imagePath: subCategory.imagePath,
                mainCategoryId: subCategory.mainCategoryId,
                urlName: subCategory.urlName,
                categories: subCategory.categories?.map((category: ICategory) => ({
                    id: category.id,
                    name: category.name,
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