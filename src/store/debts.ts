import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import useAxios from "../helper/useAxios";
import { toast } from "react-toastify";

export interface Person {
  name: string;
  surname: string;
  money: number;
  info: string;
  mobNumber: string;
  payment: [
    {
      status: string;
      money: number;
      sumOfMoney: number;
      date: {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
      };
      info: string;
    }
  ];
  status: string;
  _id: string;
  updatedAt: string;
}

export const getPersons = createAsyncThunk(
  "persons/fetch",
  async (value: {}) => {
    const { getData } = useAxios();
    try {
      const api = await getData(`getPerson`);
      const sortedPerson = api.persons.sort(function (a: Person, b: Person) {
        return new Date(a.updatedAt) < new Date(b.updatedAt) ? 1 : -1;
      });
      return sortedPerson;
    } catch {
      toast.error("შეცდომაა! თავიდან შემოდით!");
    }
  }
);

interface CounterState {
  persons:
    | [
        {
          name: string;
          updatedAt: string;
          surname: string;
          money: 0;
          info: string;
          mobNumber: string;
          payment: [
            {
              status: string;
              money: number;
              sumOfMoney: number;
              date: {
                year: number;
                month: number;
                day: number;
                hour: number;
                minute: number;
              };
              info: string;
            }
          ];
          status: string;
          _id: string;
        }
      ]
    | [];
  userStatus: boolean;
}

const initialState: CounterState = {
  persons: [],
  userStatus: false,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    login: (state) => {
      state.userStatus = true;
    },
    logOut: (state) => {
      state.userStatus = false;
    },
  },
  extraReducers(builder) {
    builder
      // .addCase(getPersons.pending, (state, action) => {
      // 	console.log("loading");
      // })
      .addCase(getPersons.fulfilled, (state, action) => {
        state.persons = action.payload;
      })
      .addCase(getPersons.rejected, (state, action) => {
        console.log("fail");
        state.persons = [];
      });
  },
});

export const { login, logOut } = counterSlice.actions;

export default counterSlice.reducer;
