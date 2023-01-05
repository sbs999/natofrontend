import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import useAxios from '../helper/useAxios';
import {toast} from "react-toastify";

interface Person {
    name: string,
    surname: string,
    money: number,
    info: string,
    mobNumber: string,          
    payment: [{status: string,money: number,sumOfMoney: number,date: {year: number,month: number,day: number,hour: number,minute: number},info: string}],
    status: string,
    _id: string,
    updatedAt: string
  }

export const getHistoryPersons = createAsyncThunk('historyPersons/fetch', async (value: {}) => {
    const {getData} = useAxios();
    try {
	const api = await getData("https://natobackend.onrender.com/getPersonsFromHistory");
    const sortedPerson = api.persons.sort(function (a: Person, b: Person) { return new Date(a.updatedAt) < new Date(b.updatedAt) ? 1 : -1 });
    return sortedPerson;
    }catch{
      toast.error("შეცდომაა! თავიდან შემოდით!")
    }
    return [];
});

interface CounterState {
    historyPersons: [{name: string,updatedAt: string,surname: string,info: string,mobNumber: string,_id: string}] | [],
  }
  
  const initialState: CounterState = {
    historyPersons: [],
  }

  export const historySlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
    },
    extraReducers(builder) {
        builder
			// .addCase(getHistoryPersons.pending, (state, action) => {
			// 	console.log("loading");
			// })
			.addCase(getHistoryPersons.fulfilled, (state, action) => {
				state.historyPersons = action.payload;
			})
			.addCase(getHistoryPersons.rejected, (state, action) => {
				console.log("fail");
                state.historyPersons = [];
			});
    }
  })
   

//   export const { login, logOut } = counterSlice.actions;

  export default historySlice.reducer