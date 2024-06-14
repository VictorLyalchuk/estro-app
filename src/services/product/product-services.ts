import axios from "axios";
import { APP_ENV } from "../../env/config";
import qs from "qs";
import { IProduct } from "../../interfaces/Product/IProduct";

const baseUrl = APP_ENV.BASE_URL;

// Створюємо екземпляр axios
const instance = axios.create({
    baseURL: `${baseUrl}/api/Product`,
    headers: {
        "Content-Type": "application/json"
    }
});

export async function getQuantityProducts(filterDTO: IFilterDTO) {
    try {
        const resp = await instance.get<number>(`ProductQuantityByFilters`, {
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

export async function getProductsist(filterDTO: IFilterDTO) {
    try {
        const resp = await instance.get<IProduct[]>(`/FilterProducts`, {
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

export async function getProductById(id: string) {
    try {
        const response = await instance.get<IProduct>(`ProductByID/${id}`)
        return response.data;
    } catch (error) {
        console.error('Failed to fetch product data:', error);
        throw error;
    }
}