import React,{useState,useEffect} from 'react'
import {useNavigate} from "react-router-dom";
// import { context } from '../store/store';
import useAxios from '../../helper/useAxios';
import { useAppSelector } from '../../store/reduxStore';

const Main = () => {
  const {getData} = useAxios();
  const navigate = useNavigate();
  const {persons} = useAppSelector(state => state.persons);
  const [state,setState] = useState(persons);
  const [search,setSearch] = useState("");
  const [totalMoney,setTotlaMoney] = useState(0);
  useEffect(() => {
   const getTotalMoney = async () => {
       try {
        const api = await getData("http://localhost:8080/getTotalMoney");
        setTotlaMoney(api.totalMoney);
       }catch(error) {
         console.log(error);
         navigate("/");
       }
   }
   getTotalMoney();
  },[])

  useEffect(() => {
    setState(persons);
  },[persons])

  useEffect(() => {
    if(search) {
   const filteredInfo = persons.filter(a =>
      [a.name, a.surname, a.money, a.info]
        .join('')
        .toLowerCase()
        .includes(search.toString().toLocaleLowerCase().split(' ').join(''))
    );
    setState(filteredInfo as []);
   }else{
    setState(persons);
   }
  },[search])
  
  return (
    <>
    <button onClick={() => navigate("/")} type="submit" className='border-[1px] bg-[#3498db] p-[10px] rounded-[12px] text-white mt-[10px] ml-[10px]'>უკან გასვლა</button>
    <div className='flex justify-center flex-col items-center'>
      <div onClick={() => navigate("/addPerson")} className='w-[285px] text-[17px] bg-[#34495e] text-white p-[7px] py-[11px] flex justify-center rounded-[10px] cursor-pointer mt-[20px]'>
        <p>ადამიანის დამატება სიაში.</p>
      </div>
      <div className='mt-[30px]'>
      <div className='mb-[15px] text-center'>
        <p>მთლიანობაში ვალი - {totalMoney}ლ</p>
      </div>
        <div>
          <input type="text" onChange={(e) => setSearch(e.target.value)}  className='border-[1px]  px-[10px] py-[10px] w-[280px] rounded-[10px] border-black' placeholder='გაფილტვრა'  />
        </div>
      </div>
      <div className='mt-[10px]'>
      {state.map((d,index) => {
        return (
       <div onClick={() => navigate(`/person/${d._id}`)} key={index} className='bg-[#ecf0f1] text-center  w-[280px]  text-[17px] mt-[5px] h-[50px] flex justify-center items-center cursor-pointer'>
       {d.name}  {d.surname} - {d.money}ლ
      </div>
        )
      })
}
</div>
</div>
</>
  )
}

export default Main


