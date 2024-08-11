import { IImageItem } from "./IProduct";

export interface IProductEdit {
    images: never[];
    id: number;
    name: string;
    description: string; 
    price: number; 
    material: string; 
    season: string; 
    color: string; 
    article: string; 
    ImagesFile : IImageItem [] | null;  
    categoryId : number;
    storageId: number | null;
}