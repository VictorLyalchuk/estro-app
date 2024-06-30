import axios from 'axios';
import { IStore } from '../../interfaces/Catalog/IStore';
import { APP_ENV } from '../../env/config';
import { ICity } from '../../interfaces/Address/ICity';
import { ICountry } from '../../interfaces/Address/ICountry';

const baseUrl = APP_ENV.BASE_URL;

// Створюємо екземпляр axios
const instance = axios.create({
    baseURL: `${baseUrl}/api/StoreControllers`,
    headers: {
        "Content-Type": "application/json"
    }
});

export async function getStore() {
    try {
        const response = await instance.get<IStore[]>(`StoreAll`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch store data:', error);
        throw error;
    }
};

export async function getCountry() {
    try {
        const response = await instance.get<ICountry[]>(`getCountry`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch country data:', error);
        throw error;
    }
};

export async function getCity() {
    try {
        const response = await instance.get<ICity[]>(`getCity`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch city data:', error);
        throw error;
    }
};