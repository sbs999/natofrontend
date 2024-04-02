import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import counterSlice from "./debts";
import historySlice from "./history";
import productsPurchaseLocationSlice from "./productsToBring/locations";
import productCategories from "./productsToBring/categories";
import products from "./productsToBring/products";

export const store = configureStore({
  reducer: {
    //   posts: postsReducer,
    //   comments: commentsReducer,
    //   users: usersReducer
    persons: counterSlice,
    history: historySlice,
    productPurchaseLocations: productsPurchaseLocationSlice,
    ProductCategories: productCategories,
    products,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
