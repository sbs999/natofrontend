import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import  counterSlice  from './debts';
import historySlice from "./history";
import bookSlice from "./books";
export const store = configureStore({
    reducer: {
    //   posts: postsReducer,
    //   comments: commentsReducer,
    //   users: usersReducer
     persons: counterSlice,
     history: historySlice,
     books: bookSlice
    }
  })



export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector