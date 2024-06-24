import { IStorages } from "../Product/IProduct";

export interface IFavoriteProducts {
    // id: number;
    userId: string;
    productId: number;
    productName: string;
    productPrice: number;
    productImage: string;
    storages: IStorages[] | null;
}