import { IOptions } from "../../interfaces/Info/IInfo";
import { IProduct } from "../../interfaces/Product/IProduct";

export const getLocalizedField = (product: IProduct, field: string, lang: string): string => {
  return product[`${field}_${lang}` as keyof IProduct] as string;
};

export const getLocalizedFieldArray = (product: IProduct, field: string, lang: string): string[] => {
  return product[`${field}_${lang}` as keyof IProduct] as string[];
};

export const transformToOptions = (options: any[], language: string): IOptions[] => {
  return options.map(option => ({
    id: option.id.toString(),
    label: (() => {
      switch (language) {
        case 'uk':
          return option.name_uk;
        case 'es':
          return option.name_es;
        case 'fr':
          return option.name_fr;
        case 'en':
          return option.name_en;
        default:
          return option.name_en;
      }
    })(),
    value: option.value
  }));
};