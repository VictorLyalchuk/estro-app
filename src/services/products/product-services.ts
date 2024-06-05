import axios from "axios";
import { APP_ENV } from "../../env/config";
import { IProduct } from "../../interfaces/Site/IProduct";

const baseUrl = APP_ENV.BASE_URL;

// Створюємо екземпляр axios
const instance = axios.create({
    baseURL: `${baseUrl}/api/AccountControllers`,
    headers: {
        "Content-Type": "application/json"
    }
});

export async function getProductById(id: string) {
    try {
        const response = await instance.get<IProduct>(`${baseUrl}/api/Product/ProductByID/${id}`)
        return response.data;
    } catch (error) {
        console.error('Failed to fetch product data:', error);
        throw error;
    }
}