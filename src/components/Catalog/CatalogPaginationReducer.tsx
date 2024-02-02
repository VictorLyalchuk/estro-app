export enum PaginationReducerCatalogActionType {
    CURRENT_CATALOG_PAGE = "SET_CURRENT_CATALOG_PAGE",
    TOTAL_CATALOG_PRODUCTS = "SET_TOTAL_CATALOG_PRODUCTS",
    UPDATE_FILTERS = "UPDATE_FILTERS",
    SET_SUBNAME = "SET_SUBNAME",
    SET_CATEGORY = "SET_CATEGORY",
}
export interface IPaginationCatalogReducerState {
    currentPage: number | null;
    totalProducts: number | null;
    filters: { name: string; values: string[] }[];
    subName: string | null;
    categoryName: string | null;
}

interface IPaginationReducerActionCatalog {
    type: PaginationReducerCatalogActionType;
    payload?: { currentPage?: number; totalProducts?: number; filters?: { name: string; values: string[] }[]; subName: string; categoryName: string, };
}
const initState: IPaginationCatalogReducerState = {
    currentPage: 1,
    totalProducts: 0,
    filters: [],
    subName: "",
    categoryName: "",
};

const paginationCatalogReducer = (state = initState, action: IPaginationReducerActionCatalog): IPaginationCatalogReducerState => {
    switch (action.type) {
        case PaginationReducerCatalogActionType.CURRENT_CATALOG_PAGE:
            return {
                ...state,
                currentPage: action.payload?.currentPage || null,
            };
        case PaginationReducerCatalogActionType.TOTAL_CATALOG_PRODUCTS:
            return {
                ...state,
                totalProducts: action.payload?.totalProducts || null
            };
        case PaginationReducerCatalogActionType.UPDATE_FILTERS:
            return {
                ...state,
                filters: action.payload?.filters || [],
            };
        case PaginationReducerCatalogActionType.SET_SUBNAME:
            return {
                ...state,
                subName: action.payload?.subName || "",
            };
        case PaginationReducerCatalogActionType.SET_CATEGORY:
            return {
                ...state,
                categoryName: action.payload?.categoryName || "",
            };

        default:
            return state;
    }
};
export default paginationCatalogReducer;