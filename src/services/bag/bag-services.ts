import axios from "axios";
import { APP_ENV } from "../../env/config";
import { IBag } from "../../interfaces/Bag/IBag";
import { BagReducerActionType } from "../../store/bag/BagReducer";

const baseUrl = APP_ENV.BASE_URL;

// Створюємо екземпляр axios
const instance = axios.create({
    baseURL: `${baseUrl}/api/Bag`,
    headers: {
        "Content-Type": "application/json"
    }
});

export async function createBag(bag: IBag) {
    try {
        await instance.post(`CreateBag`, bag)
    } catch (error) {
        console.error('Failed to fetch product data:', error);
        throw error;
    }
}

export async function getCountBagByEmail(email: string, dispatch: any) {
    try {
        const response = await instance.get<number>(`GetCountBagByEmail/${email}`);
        dispatch({
            type: BagReducerActionType.GET_PRODUCT_BAG_COUNT,
            payload: {
                count: response.data
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch product data:', error);
        throw error;
    }
}