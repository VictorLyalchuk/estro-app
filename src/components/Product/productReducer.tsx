import { IProduct } from '../interfaces/Site/IProduct';

export enum ProductReducerActionType {
    SET = "SET_PRODUCT",
    DELETE = "DELETE_PRODUCT",
}

export interface IProductReducerState {
    products: IProduct[] | null;
}

interface IProductReducerAction {
    type: ProductReducerActionType;
    payload?: { products?: IProduct[]; productId?: number }; 
}

const initState: IProductReducerState = {
    products: null,
};

const ProductReducer = (state = initState, action: IProductReducerAction): IProductReducerState => {
    switch (action.type) {
        case ProductReducerActionType.SET:
            return {
                // ...state,
                products: action.payload?.products || null,
            };
        case ProductReducerActionType.DELETE:
            const productIdToDelete = action.payload?.productId;
    
            if (!productIdToDelete || !state.products) {
                return state;
              }
    
              const newProducts = state.products.filter(product => product.id !== productIdToDelete);
            //   console.log('newProducts:', newProducts);
            return {
                // ...state,
                products: newProducts,
            };

        default: {
            return state;
        }
    }
}

export default ProductReducer;
