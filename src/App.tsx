import React,{useContext,useEffect, useState} from 'react';
import {Route,Routes} from "react-router-dom"
import './App.css';
import Main from './pages/main';
import AddPerson from './pages/AddPerson';
import { context } from './store/store';
import EachPerson from './pages/EachPerson';
import HistoryForm from './components/addPerson/historyForm';
import UpdatePerson from './pages/UpdatePerson';
import emailjs from '@emailjs/browser';
import Security from './pages/Security';
function App() {
  const {getPersons,getPersonsFromHistory,userStatus,changeUserStatus} = useContext(context); 
  

  useEffect(() => {
    if(localStorage.getItem("tokenShop")){
      getPersons();
      getPersonsFromHistory();
    }
  },[userStatus]);
  // auth
  useEffect(() => {
     if(localStorage.getItem("tokenShop")) {
      changeUserStatus(true);
      }else{
      changeUserStatus(false);
      }
   },[]);
  return (
    <div className='mb-[10px]'>
    <Routes>
      <Route path="/" element={userStatus ? <Main /> :  <Security />} />
      <Route path="/person/:personId" element={userStatus ? <EachPerson /> :  <Security />} />
      <Route path="/addPerson" element={userStatus ? <AddPerson /> :  <Security />} />
      <Route path="/addPerson/:historyId" element={userStatus ? <HistoryForm /> :  <Security />} />
      <Route path="/updatePersonInfo/:personId" element={userStatus ? <UpdatePerson /> :  <Security />} />
    </Routes>
    </div>
  );
}

export default App;


