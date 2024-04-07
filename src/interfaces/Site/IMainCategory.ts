export interface IMainCategory {
    id: number;
    name: string;
    description: string | null; 
    imagePath: string | null;   
    subCategories: ISubCategory[];
}
  
export interface ISubCategory {
  id: number;
  name: string;
  description: string | null; 
  imagePath: string | null;   
  mainCategoryId: number;
  categories: ICategory[];
  urlName: string;
}
export interface ICategory {
    id: number;
    name: string;
    description: string | null; 
    imagePath: string | null;        
    subCategoryId: number;
    urlName: string;
}