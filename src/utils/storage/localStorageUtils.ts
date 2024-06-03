import { IBagUser } from "../../interfaces/Bag/IBagUser";


export const addLocalStorage = (keyStorage: string, value: IBagUser | string): void => {
    localStorage.setItem(keyStorage, JSON.stringify(value));
};

export const deleteLocalStorage = (keyStorage: string): void => {
    localStorage.removeItem(keyStorage);
};

export const getLocalStorage = (keyStorage: string) : string | IBagUser | null => {
    const storedValue = localStorage.getItem(keyStorage);

    if (storedValue !== null) {
        return JSON.parse(storedValue);
    }
    else {
        return null;
    }
};