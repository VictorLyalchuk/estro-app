import axios from "axios";
import { APP_ENV } from "../../env/config";
import qs from "qs";
import { IProduct } from "../../interfaces/Product/IProduct";
import { IProductCreate } from "../../interfaces/Product/IProductCreate";

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


//admin panel
export async function getProductByPage(page: number) {
    try {
        const response = await instance.get<IProduct[]>(`ProductByPage/${page}`)
        return response.data;
    } catch (error) {
        console.error('Failed to fetch product data:', error);
        throw error;
    }
}

export async function getProductQuantity() {
    try {
        const response = await instance.get<number>(`ProductQuantity`)
        return response.data;
    } catch (error) {
        console.error('Failed to fetch product quantity data:', error);
        throw error;
    }
}

export async function deleteProductByID(id: number) {
    try {
        await instance.delete(`DeleteProductByID/${id}`)
    } catch (error) {
        console.error('Failed to fetch product data:', error);
        throw error;
    }
}

export async function createProduct(model: IProductCreate) {
    try {
        await instance.post(`CreateProduct`, model,)
    } catch (error) {
        console.error('Failed to fetch product data:', error);
        throw error;
    }
}