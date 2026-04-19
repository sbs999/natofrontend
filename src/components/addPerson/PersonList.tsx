import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getHistoryPersons } from '../../store/history';
import { useAppSelector,useAppDispatch } from '../../store/reduxStore';
import CustomerMarkBadge from '../customer-mark/CustomerMarkBadge';
import CustomerMarkModal from '../customer-mark/CustomerMarkModal';
import { usePersonMarkModal } from '../../hooks/usePersonMarkModal';


const PersonList = () => {
    const navigate = useNavigate();
    const { open, ctx, openModal, closeModal } = usePersonMarkModal();
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
           <div key={index} className='mt-[5px] flex w-[280px] items-center gap-2 bg-[#ecf0f1] px-2 py-2 text-[17px]'>
             <CustomerMarkBadge
               mark={d.displayMark ?? d.adminMark}
               onOpen={() => d._id && openModal(d._id, 'history')}
             />
             <div onClick={() => navigate(`/addPerson/${d._id}`)} className='flex min-h-[40px] flex-1 cursor-pointer items-center justify-center text-center'>
         {d.name}  {d.surname}
         </div>
         </div>
       )
    })
}
</div>
    {ctx && (
      <CustomerMarkModal
        open={open}
        personId={ctx.personId}
        source={ctx.source}
        onClose={closeModal}
      />
    )}
    </div>
  )
}

export default PersonList
