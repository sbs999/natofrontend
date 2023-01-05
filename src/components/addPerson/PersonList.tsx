import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getHistoryPersons } from '../../store/history';
import { useAppSelector,useAppDispatch } from '../../store/reduxStore';


const PersonList = () => {
    const navigate = useNavigate();
    const {historyPersons} = useAppSelector(state => state.history);
    const [state,setState] = useState(historyPersons);
    const dispatch = useAppDispatch();
    const [search,setSearch] = useState("");
     useEffect(() => {
      dispatch(getHistoryPersons({}));
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
      setState(filteredInfo as []);
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
