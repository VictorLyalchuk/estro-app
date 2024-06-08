import axios from "axios";
import { APP_ENV } from "../../env/config";

const baseUrl = APP_ENV.BASE_URL;

// Створюємо екземпляр axios
const instance = axios.create({
    baseURL: `${baseUrl}/api/OrderControllers`,
    headers: {
        "Content-Type": "application/json"
    }
});

export async function getProfileOrders(userEmail: string | null, page: number) {
    try {
        const response = await instance.get<IOrderUser[]>(`GetOrderByEmail/${userEmail}`, { params: { page } });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user data:', error);
        throw error;
    }
}

export async function getUserOrders(userEmail: string | null) {
    try {
        const response = await instance.get<number>(`GetCountOrderByEmail/${userEmail}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user data:', error);
        throw error;
    }
}