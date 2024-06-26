interface IFilterDTO {
    Size?: string[];
    Material?: string[];
    Color?: string[];
    Purpose?: string[];
    Page?: number | string[];
    ItemsPerPage?: number | string[];
    Sort?: string | string[];
    Search?: string;
    MainCategory?: string | string[];    
    SubName?: string | string[];    
    UrlName?: string | string[];
}