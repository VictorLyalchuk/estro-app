export interface ICategory {
    id: number;
    name_en: string;
    name_es: string;
    name_uk: string;
    name_fr: string;
    description: string | null; 
    imagePath: string | null;        
    subCategoryId: number;
    mainCategoryId:number;
    urlName: string;
}