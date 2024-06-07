import axios from "axios";
import { APP_ENV } from "../../env/config";
import { ICategory } from "../../interfaces/Site/IMainCategory";
import { IInfo } from "../../interfaces/Info/IInfo";
import qs from "qs";
import { IProduct } from "../../interfaces/Site/IProduct";

const baseUrl = APP_ENV.BASE_URL;

// Створюємо екземпляр axios
const instance = axios.create({
    baseURL: `${baseUrl}/api/AccountControllers`,
    headers: {
        "Content-Type": "application/json"
    }
});

export async function getCategoryList(subName: string) {
    try {
        const resp = await instance.get<ICategory[]>(`${baseUrl}/api/CategoryControllers/CategoryGetWithSub`, {
            params: { subName }
        });
        return resp.data;
    } catch (error) {
        console.error('Failed to fetch product data:', error);
        throw error;
    }
}

export async function getInfoList(subName: string) {
    try {
        const resp = await instance.get<IInfo[]>(`${baseUrl}/api/Info/GetInfo/${subName}`,);
        return resp.data;
    } catch (error) {
        console.error('Failed to fetch product data:', error);
        throw error;
    }
}

export async function getQuantityProducts(subName: string, urlName: string, filterDTO: IFilterDTO) {
    try {
        const resp = await instance.get<number>(`${baseUrl}/api/Product/ProductQuantityByFilters/${subName}/${urlName}`, {
            params: filterDTO,
            paramsSerializer: (params) => {
              return qs.stringify(params, { arrayFormat: 'repeat' });
            }      
        });
        return resp.data;
    } catch (error) {
        console.error('Failed to fetch product data:', error);
        throw error;
    }
}

export async function getProductsist(subName: string, urlName: string, filterDTO: IFilterDTO) {
    try {
        const resp = await instance.get<IProduct[]>(`${baseUrl}/api/Product/FilterProducts/${subName}/${urlName}`, {
            params: filterDTO, paramsSerializer: (params) => {
              return qs.stringify(params, { arrayFormat: 'repeat' });
            }
          });
        return resp.data;
    } catch (error) {
        console.error('Failed to fetch product data:', error);
        throw error;
    }
}