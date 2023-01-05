import React,{useEffect} from 'react';
import {Route,Routes} from "react-router-dom"
import './App.css';
import Main from './pages/main';
import AddPerson from './pages/AddPerson';
import EachPerson from './pages/EachPerson';
import HistoryForm from './components/addPerson/historyForm';
import UpdatePerson from './pages/UpdatePerson';
import { useAppSelector,useAppDispatch } from './store/reduxStore';
import Security from './pages/Security';
import { getPersons as fetchPersons, login, logOut } from './store/debts';
import {getHistoryPersons} from "./store/history";
function App() {
  const {userStatus} = useAppSelector(state => state.persons);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if(localStorage.getItem("tokenShop")){
      dispatch(fetchPersons({}));
      dispatch(getHistoryPersons({}));
    }
  },[userStatus]);
  // auth
  useEffect(() => {
     if(localStorage.getItem("tokenShop")) {
      dispatch(login())
      }else{
      dispatch(logOut())
      }
   },[]);
   const authCheck = localStorage.getItem("tokenShop") && userStatus;
  return (
    <div className='mb-[10px]'>
    <Routes>
      <Route path="/" element={authCheck ? <Main /> :  <Security />} />
      <Route path="/person/:personId" element={authCheck ? <EachPerson /> :  <Security />} />
      <Route path="/addPerson" element={authCheck ? <AddPerson /> :  <Security />} />
      <Route path="/addPerson/:historyId" element={authCheck ? <HistoryForm /> :  <Security />} />
      <Route path="/updatePersonInfo/:personId" element={authCheck ? <UpdatePerson /> :  <Security />} />
    </Routes>
    </div>
  );
}

export default App;


