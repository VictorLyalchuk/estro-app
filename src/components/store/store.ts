import {combineReducers} from "redux";
import {configureStore} from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import AuthReducer from "../../components/auth/login/AuthReducer";
import productReducer from '../Product/productReducer';
import TableProductsReducer from "../Dashboard/pages/TableProductsReducer";
import ProductsReducer from "../Catalog/CatalogPaginationReducer";
import bagReducer from "../Bag/BagReducer";
import cardReducer from "../Bag/CardReducer";

export const rootReducer = combineReducers({
    auth: AuthReducer,
    products: productReducer,
    paginationProdDashboard: TableProductsReducer,
    paginationProduct: ProductsReducer,
    bagReducer: bagReducer,
    cardReducer: cardReducer,
});

export const store = configureStore({
   reducer: rootReducer,
   devTools: true,
   middleware: [thunk] 
});