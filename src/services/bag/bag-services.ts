import axios from "axios";
import { APP_ENV } from "../../env/config";
import { IBag } from "../../interfaces/Bag/IBag";

const baseUrl = APP_ENV.BASE_URL;

// Створюємо екземпляр axios
const instance = axios.create({
    baseURL: `${baseUrl}/api/AccountControllers`,
    headers: {
        "Content-Type": "application/json"
    }
});

export async function createBag(bag: IBag) {
    try {
        await instance.post(`${baseUrl}/api/Bag/CreateBag`, bag)
    } catch (error) {
        console.error('Failed to fetch product data:', error);
        throw error;
    }
}