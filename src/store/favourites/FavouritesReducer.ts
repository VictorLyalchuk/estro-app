import { IFavoriteProductsID } from '../../interfaces/FavoriteProducts/IFavoriteProductsID';

export enum FavouritesReducerActionType {
  SET = "SET_FAVORITE_PRODUCTS",
  ADD = "ADD_TO_FAVORITE",
  REMOVE = "REMOVE_FROM_FAVORITE",
  DELETE_ALL = "DELETE_ALL"
}

export interface IFavoriteProductsState {
  favoriteProducts: IFavoriteProductsID[];
  count: number,
}

interface SetFavoritesAction {
  type: FavouritesReducerActionType.SET;
  payload: IFavoriteProductsID[];
}

interface AddFavoriteAction {
  type: FavouritesReducerActionType.ADD;
  payload: IFavoriteProductsID;
}

interface RemoveFavoriteAction {
  type: FavouritesReducerActionType.REMOVE;
  payload: IFavoriteProductsID;
}

interface DeleteAllFavoriteAction {
  type: FavouritesReducerActionType.DELETE_ALL;
  payload: IFavoriteProductsID;
}
type FavouritesReducerAction = SetFavoritesAction | AddFavoriteAction | RemoveFavoriteAction | DeleteAllFavoriteAction;

const initState: IFavoriteProductsState = {
  favoriteProducts: [],
  count: 0,
};
export const setFavoriteProducts = (products: IFavoriteProductsID[]) => ({
  type: FavouritesReducerActionType.SET,
  payload: products,
});

export const addToFavorite = (product: IFavoriteProductsID) => ({
  type: FavouritesReducerActionType.ADD,
  payload: product,
});

export const removeFromFavorite = (product: IFavoriteProductsID) => ({
  type: FavouritesReducerActionType.REMOVE,
  payload: product,
});
export const deleteAllFromFavorite = (product: IFavoriteProductsID) => ({
  type: FavouritesReducerActionType.DELETE_ALL,
  payload: product,
});

const favouritesReducer = (state = initState, action: FavouritesReducerAction): IFavoriteProductsState => {
  switch (action.type) {
    case FavouritesReducerActionType.SET:
      return {
        ...state,
        favoriteProducts: action.payload,
        count: action.payload.length
      };
    case FavouritesReducerActionType.ADD:
      return {
        ...state,
        favoriteProducts: [...state.favoriteProducts, action.payload],
        count: state.count + 1
      };
    case FavouritesReducerActionType.REMOVE:
      return {
        ...state,
        favoriteProducts: state.favoriteProducts.filter(product => product.productId !== action.payload.productId),
        count: state.count - 1
      };
    case FavouritesReducerActionType.DELETE_ALL:
      return {
        ...state,
        count: 0,
        favoriteProducts: []
      };
    default:
      return state;
  }
};

export default favouritesReducer;