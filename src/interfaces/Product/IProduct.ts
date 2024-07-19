export interface IProduct {
    id: number;
    name: string;
    description: string; 
    details: string; 
    highlights: string []; 
    price: number; 
    
    material_en: string; 
    material_uk: string; 
    material_es: string; 
    material_fr: string; 
    
    season_en: string; 
    season_uk: string; 
    season_es: string; 
    season_fr: string; 

    color_en: string;
    color_uk: string;
    color_es: string;
    color_fr: string;

    article: string; 
    images: IImage[] | null;  
    imagesPath: string [] | null;  
    subCategoryId: number;
    categoryId: number;
    categoryName: string;
    subCategoryName: string [] | null; 
    mainCategoryName: string [] | null; 

    storages: IStorages[] | null;
    storageQuantity: number;
    urlMainCategoryName: string [] | null; 
    urlSubCategoryName: string [] | null; 
    urlCategoryName: string [] | null;  
}

export interface IStorages{
    id: number;
    productId: number;
    productQuantity : number;
    size: number;
    inStock: boolean;
}

export interface IImage {
    id: number;
    imagePath: string;
    productId: number;
    ImageFile: File;
  }

  export interface IImageItem {
    id: number;
    imagePath: string;
  }
