export enum PaginationReducerActionType {
    CURRENT_PAGE = "SET_CURRENT_PAGE",
    TOTAL_PRODUCTS = "SET_TOTAL_PRODUCTS",
    PRODUCTS_DECREASE = "TOTAL_PRODUCTS_DECREASE",
}
export interface IPaginationReducerState {
    currentPage: number | null;
    totalProducts: number | null;
}

interface IPaginationReducerAction {
    type: PaginationReducerActionType;
    payload?: { currentPage?: number; totalProducts?: number };
}
const initState: IPaginationReducerState = {
    currentPage: 1,
    totalProducts: 0,
};

const paginationReducer = (state = initState, action: IPaginationReducerAction): IPaginationReducerState => {
    switch (action.type) {
        case PaginationReducerActionType.CURRENT_PAGE:
            return { 
                ...state, 
                currentPage: action.payload?.currentPage || null,
            };
        case PaginationReducerActionType.TOTAL_PRODUCTS:
            return { 
                ...state, 
                totalProducts: action.payload?.totalProducts || null
            };
        case PaginationReducerActionType.PRODUCTS_DECREASE:
            return { 
                ...state, 
                totalProducts: (state.totalProducts || 0) - 1
            };
        default:
            return state;
    }
};
export default paginationReducer;