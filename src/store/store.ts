import {combineReducers} from "redux";
import {configureStore} from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import AuthReducer from "./accounts/AuthReducer";
// import productReducer from './product/productReducer';
// import TableProductsReducer from "../components/Dashboard/pages/TableProductsReducer";
import bagReducer from "./bag/BagReducer";
import cardReducer from "./bag/CardReducer";

export const rootReducer = combineReducers({
    auth: AuthReducer,
    // products: productReducer,
    // paginationProdDashboard: TableProductsReducer,
    bagReducer: bagReducer,
    cardReducer: cardReducer,
});

export const store = configureStore({
   reducer: rootReducer,
   devTools: true,
   middleware: [thunk] 
});