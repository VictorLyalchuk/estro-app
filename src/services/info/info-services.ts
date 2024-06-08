import axios from "axios";
import { APP_ENV } from "../../env/config";
import { IInfo } from "../../interfaces/Info/IInfo";

const baseUrl = APP_ENV.BASE_URL;

// Створюємо екземпляр axios
const instance = axios.create({
    baseURL: `${baseUrl}/api/Info`,
    headers: {
        "Content-Type": "application/json"
    }
});

export async function getInfoList(subName: string) {
    try {
        const resp = await instance.get<IInfo[]>(`GetInfo/${subName}`,);
        return resp.data;
    } catch (error) {
        console.error('Failed to fetch product data:', error);
        throw error;
    }
}