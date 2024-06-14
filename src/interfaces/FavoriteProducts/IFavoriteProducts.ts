import { IProduct } from "../Product/IProduct";

export interface IFavoriteProducts{
    id: number;
    userId: string;
    productId: number;
    products: IProduct[];
}