import { useReducer,createContext, useState } from "react";
import useAxios from "../helper/useAxios";
import { toast } from 'react-toastify';
export const context = createContext({
  persons: [{name: "",surname: "",money: 0,info: "",mobNumber: "",payment: [{status: "",money: 0,sumOfMoney: 0,date: {year: 0,month: 0,day: 0,hour: 0,minute: 0},info: ""}],status: "",_id: ""}],
  historyPersons: [{name: "",surname: "",info: "",mobNumber: "",_id: ""}],
  getPersons: () => {},
  getPersonsFromHistory: () => {},
  userStatus: false,
  changeUserStatus: (status: boolean) => {}
})

const initialState = {persons: [],historyPersons: [],userStatus: false };

const reducer = (state: {persons: Array<Person>,historyPersons: Array<PersonInHistory>,userStatus: boolean},action: { type: string; payload: {persons: Array<Person>,historyPersons: Array<PersonInHistory>,userStatus: boolean} }) => {
  switch (action.type) {
    case "getPersonList":
      return {...state, persons: action.payload.persons};
    case "getPersonFromHistoryList":
      return {...state, historyPersons: action.payload.historyPersons};
    case "changeUserStatus":
      return {...state,userStatus: action.payload.userStatus};
    default:
      return state;
  }
}
 const Store: React.FC<{children: JSX.Element}> = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {getData} = useAxios();
  const getPersons = async () => {  
    try {
     const api = await getData("https://natobackend.onrender.com/getPerson");
     dispatch({type: "getPersonList",payload: {persons: api.persons,historyPersons: [],userStatus: state.userStatus}});
    }catch(error) {
      toast.error("შეცდომაა, თავიდან შემოდით საიტზე!")
      console.log(error);
    }
  }
  const getPersonsFromHistory = async() => {
    try {
      const api = await getData("https://natobackend.onrender.com/getPersonsFromHistory");
      dispatch({type: "getPersonFromHistoryList",payload: {persons: [],historyPersons: api.persons,userStatus: state.userStatus}});
    }catch(err) {
      toast.error("შეცდომაა, თავიდან შემოდით საიტზე!")
      console.log(err);
    }
  }
  const changeUserStatus = (status: boolean) => {
    dispatch({type: 'changeUserStatus',payload: {persons: [],historyPersons: [],userStatus: status}})
  }
  const value = {
    persons: state.persons,
    historyPersons: state.historyPersons,
    getPersons: getPersons,
    getPersonsFromHistory: getPersonsFromHistory,
    userStatus: state.userStatus,
    changeUserStatus: changeUserStatus
  }
  
  return (
    <context.Provider value={value}>
     {props.children}
    </context.Provider>
  );
}
interface Person {
  name: string,
  surname: string,
  money: number,
  info: string,
  mobNumber: string,          
  payment: [{status: string,money: number,sumOfMoney: number,date: {year: number,month: number,day: number,hour: number,minute: number},info: string}],
  status: string,
  _id: string,
}

interface PersonInHistory {
  name: string,
  surname: string,
  info: string,
  mobNumber: string,
  _id: string,
}
export default Store;