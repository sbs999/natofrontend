import React,{useContext,useState,useEffect} from 'react'
import {useNavigate} from "react-router-dom";
import { context } from '../store/store';
interface Person {
  name: string,
  surname: string,
  money: number,
  info: string,
  mobNumber: string,          
  payment: [{status: string,money: number,date: {year: number,month: number,day: number,hour: number,minute: number},info: string}],
  status: string
}

const Main = () => {
  const navigate = useNavigate();
  const {persons} = useContext(context);
  const [state,setState] = useState(persons);
  const [search,setSearch] = useState("");

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
    setState(filteredInfo)
   }else{
    setState(persons);
   }
  },[search])
  
  return (
    <div className='flex justify-center flex-col items-center'>
      <div onClick={() => navigate("/addPerson")} className='w-[250px]  text-[17px] bg-[#34495e] text-white p-[7px] flex justify-center rounded-[10px] cursor-pointer mt-[20px]'>
        <p>ადამიანის დამატება სიაში.</p>
      </div>
      <div>
        <div>
          <input type="text" onChange={(e) => setSearch(e.target.value)}  className='border-[1px] mt-[30px] px-[10px] py-[10px] w-[270px] rounded-[10px] border-black' placeholder='გაფილტვრა'  />
        </div>
      </div>
      <div className='mt-[10px]'>
      {state.map((d,index) => {
        return (
       <div onClick={() => navigate(`/person/${d._id}`)} key={index} className='bg-[#ecf0f1] text-center  w-[270px]  text-[17px] mt-[5px] h-[50px] flex justify-center items-center cursor-pointer'>
       {d.name}  {d.surname} - {d.money}ლ
      </div>
        )
      })
}
</div>
</div>
  )
}

export default Main


