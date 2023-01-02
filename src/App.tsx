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
      setTimeout(() => {
        surprise();  
      },10000)
  },[]);
  // auth
  useEffect(() => {
     if(userStatus) {
      changeUserStatus(true);
      }else{
      changeUserStatus(false);
      }
   },[]);
 //
// sending email every 
  function surprise() {
    (function loop() {
        var now = new Date();
        if (now.getHours() === 22 && now.getMinutes() === 0) {
          sendEmail();
        }
        now = new Date();                  
        var delay = 60000;
        setTimeout(loop, delay);
    })();
};
const sendEmail = async () => {
  const data: string[] = [];
  persons.forEach(p => data.push(`${p.name}  ${p.surname} - ${p.money}`))
  try {
    console.log('data',data);
    console.log('persons',persons);
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


// 0
// : 
// {_id: '63b3191292d83d1b7f74aee6', name: 'თაკო', surname: '...', money: 32.8, info: 'ზებრა კორპუსი', …}
// 1
// : 
// {_id: '63b318aa92d83d1b7f74aec6', name: 'თემური', surname: 'დოლბაია', money: 3.6, info: '', …}
// 2
// : 
// {_id: '63b3183a92d83d1b7f74aea7', name: 'ჯონი', surname: '...', money: 8.9, info: '19 კ', …}
// 3
// : 
// {_id: '63b317cb92d83d1b7f74ae89', name: 'თაკო', surname: ',,,', money: 60.3, info: 'აკო', …}
// 4
// : 
// {_id: '63b310c092d83d1b7f74ad08', name: 'ეკა', surname: 'ჯიბლაძე', money: 63.7, info: 'ტყუპები', …}
// 5
// : 
// {_id: '63b316e692d83d1b7f74ae35', name: 'რიტა', surname: 'კაკულია', money: 13.6, info: '', …}
// 6
// : 
// {_id: '63b3156192d83d1b7f74adf9', name: 'მარიამი', surname: '...', money: 1.5, info: 'ეკა . ნანა', …}
// 7
// : 
// {_id: '63b314c492d83d1b7f74adde', name: 'თინა', surname: '...', money: 87.7, info: 'ნანას დეიდა', …}
// 8
// : 
// {_id: '63b3138a92d83d1b7f74adc3', name: 'შორენა', surname: 'ხათაშვილი', money: 18, info: '', …}
// 9
// : 
// {_id: '63b311f292d83d1b7f74ad66', name: 'ლელა', surname: '...', money: 32, info: '20 იანვარი. გაბო. შორენა ხათაშვილი', …}
// 10
// : 
// {_id: '63b3103292d83d1b7f74acf4', name: 'თამუნა', surname: '...', money: 22.2, info: 'ბექა', …}
// 11
// : 
// {_id: '63b30f8892d83d1b7f74accd', name: 'ნინო', surname: '...', money: 10, info: 'K 16', …}
// 12
// : 
// {_id: '63b30d6092d83d1b7f74ac7d', name: 'მირიანი', surname: '...', money: 108.2, info: 'ნინო', …}
// 13
// : 
// {_id: '63b30c9992d83d1b7f74ac70', name: 'ნინი', surname: '...', money: 27, info: 'ელენა', …}
// 14
// : 
// {_id: '63b30bfe92d83d1b7f74ac58', name: 'ნათია', surname: 'ჯამასპიშვილი', money: 73.8, info: '23 კ', …}
// 15
// : 
// {_id: '63b30ad392d83d1b7f74ac4c', name: 'მილანა', surname: '...', money: 65, info: 'მეზობელი', …}
// 16
// : 
// {_id: '63b309df92d83d1b7f74ac3c', name: 'რიტა', surname: 'თამაზაშვილი', money: 17, info: '20 იანვარი  შორენას და', …}
// length
// : 
// 17
// [[Prototype]]
// : 
// Array(0)
