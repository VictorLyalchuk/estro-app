import { BagItems } from "../../interfaces/Info/IBagUser";

export enum CardReducerActionType {
    SET = "SET_ITEM",
    DELETE = "DELETE_ITEM",
    ADD_QUANTITY = "ADD_QUANTITY",
    SUBTRACT_QUANTITY = "SUBTRACT_QUANTITY",
    UPDATE_TOTAL = "UPDATE_TOTAL",
    DELETE_ALL = "DELETE_ALL",
}

export interface ICardReducerState {
    items: BagItems[] | null,
    quantity: number,
    total: number,
    taxes: string,
    totalWithOutTax: string,
    initialIndividualItemPrice: { [itemId: number]: number };
}

interface ICardReducerAction {
    type: CardReducerActionType;
    payload?: { items?: BagItems[]; itemId?: number; quantity?: number; total?: number; taxes: string; totalWithOutTax: string };
}

const initState: ICardReducerState = {
    items: null,
    quantity: 0,
    total: 0,
    taxes: "",
    totalWithOutTax: ",",
    initialIndividualItemPrice: {},
}

const cardReducer = (state = initState, action: ICardReducerAction): ICardReducerState => {
    switch (action.type) {
        case CardReducerActionType.SET:
            const items = action.payload?.items || null;
            if (!items) {
                return state;
            }
            const initialTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const initialTaxes = (initialTotal / (100 + 20) * 20);
            const initialTotalWithOutTax = initialTotal - initialTaxes;
            const initialIndividualItemPrice: { [itemId: number]: number } = {};
            items.forEach(item => { initialIndividualItemPrice[item.id] = item.price * item.quantity; });

            return {
                ...state,
                items: items,
                total: initialTotal,
                taxes: (initialTaxes).toFixed(2),
                totalWithOutTax: (initialTotalWithOutTax).toFixed(2),
                initialIndividualItemPrice: initialIndividualItemPrice,
            };
        case CardReducerActionType.DELETE:
            const itemIdToDelete = action.payload?.itemId;
            if (!itemIdToDelete || !state.items) {
                return state;
            }

            const newItems = state.items.filter(item => item.id !== itemIdToDelete);
            return {
                ...state,
                items: newItems,
            };

        case CardReducerActionType.DELETE_ALL:
            return {
                items: [],
                total: 0,
                quantity: 0,
                totalWithOutTax: "",
                initialIndividualItemPrice: {},
                taxes: "",
            };


        case CardReducerActionType.ADD_QUANTITY:
            const itemIdToAdd = action.payload?.itemId;
            if (!itemIdToAdd || !state.items) {
                return state;
            }

            const updatedItemsAdd = state.items.map((item) =>
                item.id === itemIdToAdd ? { ...item, quantity: item.quantity + 1 } : item);

            return {
                ...state,
                items: updatedItemsAdd,
            };
        case CardReducerActionType.SUBTRACT_QUANTITY:
            const itemIdToSubtract = action.payload?.itemId;
            if (!itemIdToSubtract || !state.items) {
                return state;
            }

            const updatedItemsSubtract = state.items.map((item) => item.id === itemIdToSubtract && item.quantity > 0 ? { ...item, quantity: item.quantity - 1 } : item);
            return {
                ...state,
                items: updatedItemsSubtract,
            };

        default:
            return state;
    }
}

export default cardReducer;