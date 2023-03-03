import React, { useEffect, useState } from 'react'
import AddFormSchema from "./AddFormSchema";
import { useNavigate,useParams,Link } from 'react-router-dom';
import { useAppSelector } from '../../../store/reduxStore';
  
const HistoryForm = () => {
    const {historyId} = useParams();
    const {historyPersons} = useAppSelector(state => state.history);
    const [state,setState] = useState(historyPersons.filter(p => p._id?.toString() === historyId?.toString()));
    const navigate = useNavigate();
    
    useEffect(() => {
        setState(historyPersons.filter(p => p._id?.toString() === historyId?.toString()));
    },[historyPersons])

  return (
    <>
     <div className='flex justify-between items-center mt-[10px] '>
    <button onClick={() => navigate("/addPerson")} type="submit" className='border-[1px] bg-[#3498db] p-[10px] rounded-[12px] text-white ml-[10px]'>უკან გასვლა</button>
      <Link to="/" className='mr-[9px] text-gray-500'><p>დასაწყისი</p></Link> 
    </div>
     {state.length <= 0 ? (
        <p>შეცდომაა, არა არის ასეთი ადამიანი თავიდან სცადეთ!</p>
     ) : (
        <div className='max-w-[270px] mx-auto mt-[30px]'>
        <div className='grid place-content-center mb-[25px] text-[22px] '>
        <p>ადამიანის დამატება</p>
        </div>
        <AddFormSchema  name={state[0].name} surname={state[0].surname} mobNumber={state[0].mobNumber!} info={state[0].info!} histroyStatus={{status: "history",id: state[0]._id!}}  />
    </div> 
     )}
    </>
  )
}


export default HistoryForm