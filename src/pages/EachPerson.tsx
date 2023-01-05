import React,{useState,useEffect} from 'react'
import { useNavigate,useParams } from 'react-router-dom'
import { useAppSelector } from '../store/reduxStore';
import EachPersonForm from '../components/EachPerson/EachPersonForm';
const EachPerson = () => {
    const {persons} = useAppSelector(state => state.persons);
    const {personId} = useParams();
    const [state,setState] = useState(persons.filter(p => p._id.toString() === personId?.toString()));
    const navigate = useNavigate();

    useEffect(() => {
       setState(persons.filter(p => p._id === personId));
    },[persons])

  return (
    <div>
      <div className='flex justify-between items-end'>
        <button onClick={() => navigate("/")} type="submit" className='border-[1px] bg-[#3498db] p-[10px] rounded-[12px] text-white mt-[10px] ml-[10px]'>უკან გასვლა</button>
       {state.length > 0 && <p onClick={() => navigate(`/updatePersonInfo/${state[0]._id}`)} className='mr-[10px] text-gray-400 underline cursor-pointer'>განახლება</p>}
        </div>
        {state.length <= 0 ? (
         <div className='mt-[50px]'>შეცდომაა,თავიდან სცადეთ! არა არის ასეთი ადამიანი!</div>
        ) : (
        <div className='mt-[30px] '>
          <div className='flex flex-col items-center justify-center mx-[6px] text-center'>
           <div className='text-[22px]'>{state[0].name} {state[0].surname}</div>
           <div className='text-[22px] mt-[10px]'>ვალი - {state[0].money}ლ </div>
           {state[0].mobNumber && <div className='mt-[10px]'>ტელეფონის ნომერი - {state[0].mobNumber}</div>}
           {state[0].info && <div className='mt-[10px]'>დამატებითი ინფორმაცია - {state[0].info}</div>}
          </div>
           <div className='max-w-[280px] mx-auto mt-[30px] border-[1px] p-[5px] bg-[#95a5a6] rounded-[10px] '>
                <EachPersonForm id={state[0]._id} />
              </div> 
              <div className='mt-[20px]'>
      {state[0].payment.map((d,index) => {
        return (
       <div  key={index} className={` ${d.status === "add" ? "bg-[#2ecc71]" : d.status === "edit" ? "bg-[#3498db]" : "bg-[#e74c3c]"} text-white rounded-[10px] text-center  max-w-[285px] mx-auto mt-[15px] min-h-[50px]  cursor-pointer flex justify-between items-center p-[4px] text-[17px] flex-wrap`}>
        <div className='text-start mr-[5px]'>
        <p>{d.date.day}/{d.date.month + 1}/{d.date.year}</p>
        <p>{d.date.hour}:{d.date.minute}</p>
        </div>
        <div className='text-start'>
        {d.status === "edit" ? <p> განახლებულია თანხა</p> : <p>{d.status === "add" ? "დაამატა" : "მოიტანა"} ვალი - {d.money}ლ</p>}
        <p>ჯამში ვალი - {d.sumOfMoney}ლ</p>
        </div>
        {d.info && <div className='text-start mt-[5px]'><p>დამატებითი ინფორმაცია - {d.info}</p></div>}
      </div>
        )
      })
}
</div>
        </div>
        )}
    </div>
  )
}

export default EachPerson
