import React, { useEffect, useState,useContext } from 'react'
import useAxios from '../../helper/useAxios';
import AddFormSchema from "./AddFormSchema";
import { useNavigate,useParams } from 'react-router-dom';
import { context } from '../../store/store';

  
const HistoryForm = () => {
    const {historyId} = useParams();
    const {historyPersons} = useContext(context);
    const [state,setState] = useState(historyPersons.filter(p => p._id?.toString() === historyId?.toString()));
    const navigate = useNavigate();
    
    useEffect(() => {
        setState(historyPersons.filter(p => p._id?.toString() === historyId?.toString()));
    },[historyPersons])

  return (
    <>
     <button onClick={() => navigate("/addPerson")} type="submit" className='border-[1px] bg-[#3498db] p-[10px] rounded-[12px] text-white mt-[10px] ml-[10px]'>უკან გასვლა</button>
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