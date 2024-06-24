import axios from 'axios';
import { IStore } from '../../interfaces/Catalog/IStore';
import { APP_ENV } from '../../env/config';

const baseUrl = APP_ENV.BASE_URL;

// Створюємо екземпляр axios
const instance = axios.create({
    baseURL: `${baseUrl}/api/StoreControllers`,
    headers: {
        "Content-Type": "application/json"
    }
});

export const getCity = async () => {
    const apiUrl = 'https://api.novaposhta.ua/v2.0/json/';
    const payload = {
        apiKey: 'f8df4fb4933f7b40c96b872a1901be8e',
        modelName: 'Address',
        calledMethod: 'getCities',
        methodProperties: {
        }
    };

    try {
        const response = await axios.post(apiUrl, payload);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching cities', error);
        return [];
    }
}

export const getWarehouse = async (city: string) => {
    const apiUrl = 'https://api.novaposhta.ua/v2.0/json/';
    const payload = {
        apiKey: 'f8df4fb4933f7b40c96b872a1901be8e',
        modelName: 'Address',
        calledMethod: 'getWarehouses',
        methodProperties: {
            "CityRef": city
        }
    };

    try {
        const response = await axios.post(apiUrl, payload);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching warehouses', error);
        return [];
    }
}

export const getStore = async () => {
    try {
      const resp = await instance.get<IStore[]>(`StoreAll`);
      const uniqueCities = Array.from(new Set(resp.data.map(option => option.city)));
      return { storeOptions: resp.data, storeCities: uniqueCities };
    } catch (error) {
      console.error('Error fetching stores', error);
      return { storeOptions: [], storeCities: [] };
    }
  };