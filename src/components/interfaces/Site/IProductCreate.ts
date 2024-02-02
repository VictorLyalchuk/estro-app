import { IImageItem } from "./IProduct";

export interface IProductCreate {
    name: string;
    description: string; 
    price: number; 
    material: string; 
    purpose: string; 
    color: string; 
    article: string; 
    ImagesFile: IImageItem [] | null;  
    CategoryId: number;
    storageId: number | null;
}