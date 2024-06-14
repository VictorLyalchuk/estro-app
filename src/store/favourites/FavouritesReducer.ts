import { IFavoriteProducts } from '../../interfaces/FavoriteProducts/IFavoriteProducts';

export enum FavouritesReducerActionType {
  SET = "SET_FAVORITE_PRODUCTS",
  ADD = "ADD_TO_FAVORITE",
  REMOVE = "REMOVE_FROM_FAVORITE",
  DELETE_ALL = "DELETE_ALL"
}

export interface IFavoriteProductsState {
  favoriteProducts: IFavoriteProducts[];
  count: number,
}

interface SetFavoritesAction {
  type: FavouritesReducerActionType.SET;
  payload: IFavoriteProducts[];
}

interface AddFavoriteAction {
  type: FavouritesReducerActionType.ADD;
  payload: IFavoriteProducts;
}

interface RemoveFavoriteAction {
  type: FavouritesReducerActionType.REMOVE;
  payload: IFavoriteProducts;
}

interface DeleteAllFavoriteAction {
  type: FavouritesReducerActionType.DELETE_ALL;
  payload: IFavoriteProducts;
}
type FavouritesReducerAction = SetFavoritesAction | AddFavoriteAction | RemoveFavoriteAction | DeleteAllFavoriteAction;

const initState: IFavoriteProductsState = {
  favoriteProducts: [],
  count: 0,
};
export const setFavoriteProducts = (products: IFavoriteProducts[]) => ({
  type: FavouritesReducerActionType.SET,
  payload: products,
});

export const addToFavorite = (product: IFavoriteProducts) => ({
  type: FavouritesReducerActionType.ADD,
  payload: product,
});

export const removeFromFavorite = (product: IFavoriteProducts) => ({
  type: FavouritesReducerActionType.REMOVE,
  payload: product,
});
export const deleteAllFromFavorite = (product: IFavoriteProducts) => ({
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