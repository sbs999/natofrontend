import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import useAxios from "../helper/useAxios";
import { toast } from "react-toastify";

interface HistoryPersonRow {
  name: string;
  surname: string;
  info: string;
  mobNumber: string;
  _id: string;
  adminMark?: "" | "green" | "red";
  displayMark?: "green" | "red";
}

export const getHistoryPersons = createAsyncThunk(
  "historyPersons/fetch",
  async (value: {}) => {
    const { getData } = useAxios();
    try {
      const api = await getData(`getPersonsFromHistory`);
      const sortedPerson = api.persons.sort(function (
        a: HistoryPersonRow & { updatedAt?: string },
        b: HistoryPersonRow & { updatedAt?: string }
      ) {
        const da = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const db = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return da < db ? 1 : -1;
      });
      return sortedPerson;
    } catch {
      toast.error("შეცდომაა! თავიდან შემოდით!");
    }
    return [];
  }
);

interface CounterState {
  historyPersons: HistoryPersonRow[] | [];
}

const initialState: CounterState = {
  historyPersons: [],
};

export const historySlice = createSlice({
  name: "counter",
  initialState,
  reducers: {},
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
  },
});

//   export const { login, logOut } = counterSlice.actions;

export default historySlice.reducer;
