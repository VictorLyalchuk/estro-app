import { BagItems } from "../../interfaces/Bag/IBagUser";

export enum CardReducerActionType {
    SET = "SET_ITEM",
    DELETE = "DELETE_ITEM",
    UPDATE_TOTAL = "UPDATE_TOTAL",
    DELETE_CARD_ALL = "DELETE_CARD_ALL",
}

export interface ICardReducerState {
    items: BagItems[] | null,
    total: number,
    taxes: number,
    totalWithOutTax: number,
    initialIndividualItemPrice: { [itemId: number]: number };
}

interface ICardReducerAction {
    type: CardReducerActionType;
    payload?: { items?: BagItems[]; itemId?: number; total?: number; taxes: number; totalWithOutTax: number };
}

const initState: ICardReducerState = {
    items: null,
    total: 0,
    taxes: 0,
    totalWithOutTax: 0,
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
                taxes: (initialTaxes),
                totalWithOutTax: (initialTotalWithOutTax),
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

        case CardReducerActionType.DELETE_CARD_ALL:
            return {
                items: [],
                total: 0,
                totalWithOutTax: 0,
                initialIndividualItemPrice: {},
                taxes: 0,
            };

        default:
            return state;
    }
}

export default cardReducer;