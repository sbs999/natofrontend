import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import useAxios from '../helper/useAxios';
import {toast} from "react-toastify";

interface bookType {
    name: string,
    code: string,
    quantity: number,
    payPrice: number,
    takePrice: number,
    description: string
}

export const getBooks = createAsyncThunk('books/fetch', async (value: {}) => {
    const {getData} = useAxios();
    try {
	const api = await getData("http://localhost:8080/getBooks");
    return {sulakauriBooks: api.sulakauriBooks,PalitraBooks: api.PalitraBooks,totalBooks: [...api.sulakauriBooks,...api.PalitraBooks]};
    }catch{
      toast.error("შეცდომაა! თავიდან შემოდით!")
    }
    return {sulakauriBooks: [],PalitraBooks: [],totalBooks: []};
});

interface CounterState {
    sulakauriBooks: bookType[] | [],
    PalitraBooks: bookType[] | [],
    totalBooks: bookType[] | []
  }
  
  const initialState: CounterState = {
    sulakauriBooks: [],
    PalitraBooks: [],
    totalBooks: []
  }

  export const booksSlice = createSlice({
    name: 'books',
    initialState,
    reducers: {
    },
    extraReducers(builder) {
        builder
			// .addCase(getHistoryPersons.pending, (state, action) => {
			// 	console.log("loading");
			// })
			.addCase(getBooks.fulfilled, (state, action) => {
				 state.PalitraBooks = action.payload.PalitraBooks;
                 state.sulakauriBooks = action.payload.sulakauriBooks;
                 state.totalBooks = action.payload.totalBooks;
			})
			.addCase(getBooks.rejected, (state, action) => {
				console.log("fail");
                state = {sulakauriBooks: [],PalitraBooks: [],totalBooks: []};
			});
    }
  })
   



  export default booksSlice.reducer