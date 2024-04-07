export enum BagReducerActionType {
    PRODUCT_BAG_COUNT = "SET_PRODUCT_BAG_COUNT",
    DECREASE_PRODUCT_BAG_COUNT = "DECREASE_PRODUCT_BAG_COUNT",
    DELETE_PRODUCT_BAG_COUNT = "DELETE_PRODUCT_BAG_COUNT",
    GET_PRODUCT_BAG_COUNT = "GET_PRODUCT_BAG_COUNT",
    DELETE_ALL = "DELETE_ALL"
}

export interface IBagReducerState {
    count: number | 0;
}

interface IBagReducerAction {
    type: BagReducerActionType;
    payload: { count: number }
}

const initState: IBagReducerState = {
    count: 0,
}

const bagReducer = (state = initState, action: IBagReducerAction): IBagReducerState => {
    switch (action.type) {
        case BagReducerActionType.PRODUCT_BAG_COUNT:
            return {
                ...state,
                count: state.count + 1,
            };
        case BagReducerActionType.DECREASE_PRODUCT_BAG_COUNT:
            return {
                ...state,
                count: state.count - 1,
            };
        case BagReducerActionType.DELETE_PRODUCT_BAG_COUNT:
            return {
                ...state,
                count: state.count - action.payload?.count || 0,
            };
        case BagReducerActionType.GET_PRODUCT_BAG_COUNT:
            return {
                ...state,
                count: action.payload?.count,
            };
        default:
            return state;
    }
}

export default bagReducer;