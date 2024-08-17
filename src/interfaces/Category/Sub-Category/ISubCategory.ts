import { ICategory } from "../Category/ICategory";

export interface ISubCategory {
    id: number;
    name_en: string;
    name_es: string;
    name_uk: string;
    name_fr: string;
    description: string | null; 
    imagePath: string | null;   
    mainCategoryId: number;
    categories: ICategory[];
    urlName: string;
  }