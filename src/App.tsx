import React,{useEffect} from 'react';
import {Route,Routes} from "react-router-dom"
import './App.css';
import Main from './pages/person/main';
import AddPerson from './pages/person/AddPerson';
import EachPerson from './pages/person/EachPerson';
import HistoryForm from './components/person/addPerson/historyForm';
import UpdatePerson from './pages/person/UpdatePerson';
import { useAppSelector,useAppDispatch } from './store/reduxStore';
import Security from './pages/Security';
import { login, logOut } from './store/debts';
import DebtMain from './pages/book/main';
import Sulakauri from './pages/book/sulakauri/Sulakauri';
import Navbar from './pages/Navbar';
import AddBooks from './components/book/AddBooks';
import Palitra from './pages/book/palitra/Palitra';
import { getPersons as fetchPersons } from './store/debts';
import { getHistoryPersons } from './store/history';
import { getBooks } from './store/books';
import EachPalitraBook from './pages/book/palitra/EachPalitraBook';
import EachSulakauriBook from './pages/book/sulakauri/EachSulakauriBook';
function App() {
  const {userStatus} = useAppSelector(state => state.persons);
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    if(localStorage.getItem("tokenShop")){
      dispatch(fetchPersons({}));
      dispatch(getHistoryPersons({}));
      dispatch(getBooks({}));
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
      <Route path="/" element={authCheck ? <Navbar /> :  <Security />} />

      <Route path="/persons" element={authCheck ? <Main /> :  <Security />} />
      <Route path="/person/:personId" element={authCheck ? <EachPerson /> :  <Security />} />
      <Route path="/addPerson" element={authCheck ? <AddPerson /> :  <Security />} />
      <Route path="/addPerson/:historyId" element={authCheck ? <HistoryForm /> :  <Security />} />
      <Route path="/updatePersonInfo/:personId" element={authCheck ? <UpdatePerson /> :  <Security />} />

      <Route path="/books" element={authCheck ? <DebtMain /> :  <Security />} />
      <Route path="/books/sulakauri" element={authCheck ? <Sulakauri /> :  <Security />} />
      <Route path="/books/sulakauri/:bookId" element={authCheck ? <EachSulakauriBook /> :  <Security />} />
      <Route path="/books/sulakauri/addbooks" element={authCheck ? <AddBooks publishedBy="სულაკაური" /> :  <Security />} />
      <Route path="/books/palitra" element={authCheck ? <Palitra /> :  <Security />} />
      <Route path="/books/palitra/:bookId" element={authCheck ? <EachPalitraBook /> :  <Security />} />
      <Route path="/books/palitra/addbooks" element={authCheck ? <AddBooks publishedBy="პალიტრა" /> :  <Security />} />

    </Routes>
    </div>
  );
}

export default App;


