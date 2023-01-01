import React,{useContext,useEffect} from 'react';
import {BrowserRouter,Route,Routes} from "react-router-dom"
import './App.css';
import Main from './pages/main';
import AddPerson from './pages/AddPerson';
import Store from './store/store';
import { context } from './store/store';
import EachPerson from './pages/EachPerson';
import HistoryForm from './components/addPerson/historyForm';
import UpdatePerson from './pages/UpdatePerson';
import emailjs from '@emailjs/browser';
import Security from './pages/Security';
function App() {
  const {getPersons,getPersonsFromHistory,persons,userStatus,changeUserStatus} = useContext(context);
  
  useEffect(() => {
      getPersons();
      getPersonsFromHistory();
      surprise(() => sendEmail());
  },[])
  // auth
  useEffect(() => {
     const localUser = localStorage.getItem("userStatus");
     if(localUser) {
      changeUserStatus(true);
      }else{
        changeUserStatus(false);
      }
   },[])
  // 
// sending email every 
  function surprise(cb: () => void) {
    (function loop() {
        var now = new Date();
        if (now.getHours() === 22 && now.getMinutes() === 0) {
            cb();
        }
        now = new Date();                  
        var delay = 60000;
        setTimeout(loop, delay);
    })();
}
const sendEmail = async () => {
  const data: string[] = [];
  persons.forEach(p => data.push(`${p.name}  ${p.surname} - ${p.money}`))
  try {
 await emailjs.send('service_eduetjq', 'template_brgcmls', {
    name: 'sabapachulia1234@gmail.com',
    message: data
},"HxdIg2Gynb5hyDauQ")
      .then(function(response) {
         console.log('SUCCESS!', response.status, response.text);
      }, function(error) {
         console.log('FAILED...', error);
      });
  }catch(error){
    console.log(error)
  } 
  setTimeout(() => {
  },1000)
};  
// 
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
