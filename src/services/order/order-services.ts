import axios from "axios";
import { APP_ENV } from "../../env/config";
import { IOrderCreate } from "../../interfaces/Bag/IOrderCreate";
import { CardReducerActionType } from "../../store/bag/CardReducer";
import { BagReducerActionType } from "../../store/bag/BagReducer";

const baseUrl = APP_ENV.BASE_URL;

// Створюємо екземпляр axios
const instance = axios.create({
    baseURL: `${baseUrl}/api/OrderControllers`,
    headers: {
        "Content-Type": "application/json"
    }
});

export async function getProfileOrders(Id: string | null, page: number) {
    try {
        const response = await instance.get<IOrderUser[]>(`GetOrderById/${Id}`, { params: { page } });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch orders data:', error);
        throw error;
    }
}

export async function getUserOrders(Id: string | null) {
    try {
        const response = await instance.get<number>(`GetCountOrderById/${Id}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch orders data:', error);
        throw error;
    }
}

export async function createOrder(order: IOrderCreate, dispatch: any) {
    try {
        await instance.post(`CreateOrder`, order,);
        dispatch({
            type: CardReducerActionType.DELETE_CARD_ALL,
        });
        dispatch({
            type: BagReducerActionType.DELETE_BAG_ALL,
        });
    } catch (error) {
        console.error('Failed to create user order data:', error);
        throw error;
    }
}