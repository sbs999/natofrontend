import React, { useEffect, useState,useContext } from 'react'
import useAxios from '../../helper/useAxios';
import { useNavigate } from 'react-router-dom';
import { context } from '../../store/store';
interface PersonInHistory {
  name: string,
  surname: string,
  info?: string,
  mobNumber?: string,
  _id?: string,
}

const PersonList = () => {
    const {getData} = useAxios();
    const navigate = useNavigate();
    const {historyPersons,getPersonsFromHistory} = useContext(context);
    const [state,setState] = useState(historyPersons);
    const [search,setSearch] = useState("");
     useEffect(() => {
      getPersonsFromHistory();
     },[])
    useEffect(() => {
      setState(historyPersons);
    },[historyPersons])
    
    useEffect(() => {
      if(search) {
     const filteredInfo = historyPersons.filter(a =>
        [a.name, a.surname, a.info]
          .join('')
          .toLowerCase()
          .includes(search.toString().toLocaleLowerCase().split(' ').join(''))
      );
      setState(filteredInfo);
     }else{
      setState(historyPersons);
     }
    },[search]);

  return (
    <div>
      <div className='grid place-content-center'>
          <input type="text" onChange={(e) => setSearch(e.target.value)}  className='border-[1px] mt-[30px] px-[10px] py-[10px] w-[280px] rounded-[10px] border-black' placeholder='გაფილტვრა'  />
        </div>
         <div className='mt-[20px] grid place-content-center'>
         {state.map((d,index) => {
         return (
           <div onClick={() => navigate(`/addPerson/${d._id}`)} key={index} className='bg-[#ecf0f1]  w-[280px]  text-[17px] mt-[5px] h-[50px] flex justify-center items-center cursor-pointer'>
         {d.name}  {d.surname}
         </div>
       )
    })
}
</div>
    </div>
  )
}

export default PersonList
