import axios from "axios";
import { APP_ENV } from "../../env/config";

const baseUrl = APP_ENV.BASE_URL;

// Створюємо екземпляр axios
const instance = axios.create({
    baseURL: `${baseUrl}/api/UserProductReview`,
    headers: {
        "Content-Type": "application/json"
    }
});

export async function addUserProductReview(createUserProductReviewDTO: ICreateUserProductReviewDTO) {
    try {
        await instance.post(`addReview`, createUserProductReviewDTO)
        } catch (error) {
        console.error('Failed to fetch addReview data:', error);
        throw error;
    }
}

export async function getUserProductRating(productId: any,) {
    try {
        const response = await instance.get<IUserProductRating>(`getRating`, { params: { productId } } );
        return response.data;
    } catch (error) {
        console.error('Failed to fetch product data:', error);
        throw error;
    }
}

export async function getUserProductReview(productId: any,) {
    try {
        const response = await instance.get<IUserProductReview[]>(`getReview`, { params: { productId } } );
        return response.data;
    } catch (error) {
        console.error('Failed to fetch product data:', error);
        throw error;
    }
}