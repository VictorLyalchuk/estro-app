import {combineReducers} from "redux";
import {configureStore} from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import AuthReducer from "./accounts/AuthReducer";
import productReducer from './product/productReducer';
// import TableProductsReducer from "../components/Dashboard/pages/TableProductsReducer";
import bagReducer from "./bag/BagReducer";
import cardReducer from "./bag/CardReducer";
import favouritesReducer from "./favourites/FavouritesReducer";

export const rootReducer = combineReducers({
    auth: AuthReducer,
    bag: bagReducer,
    card: cardReducer,
    favourites: favouritesReducer,
    products: productReducer,
    // paginationProdDashboard: TableProductsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
   reducer: rootReducer,
   devTools: true,
   middleware: [thunk] 
});