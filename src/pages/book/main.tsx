import React, { useState,useEffect } from 'react'
import { useNavigate,Link } from 'react-router-dom'
import { useAppSelector } from '../../store/reduxStore';
const DebtMain = () => {
    const navigate = useNavigate();
    const {totalBooks} = useAppSelector(state => state.books);
    const [state,setState] = useState(totalBooks);
    const [search,setSearch] = useState("");

    useEffect(() => {
      setState(totalBooks);
    },[totalBooks])
  
    useEffect(() => {
      if(search) {
     const filteredInfo = totalBooks.filter(a =>
        [a.name.replaceAll(' ', ''), a.code]
          .join('')
          .toLowerCase()
          .includes(search.toString().toLocaleLowerCase().split(' ').join(''))
      );
      setState(filteredInfo as []);
     }else{
      setState(totalBooks);
     }
    },[search])
  return (
    <>
    <button onClick={() => navigate("/")} type="submit" className='border-[1px] bg-[#3498db] p-[10px] rounded-[12px] text-white mt-[10px] ml-[10px]'>უკან გასვლა</button>
    <div className='flex justify-center flex-col items-center'>
        <div></div>
      <div className='mt-[30px]'>
      <div className='flex max-w-[300px] mx-auto rounded-[10px] justify-between mb-[20px] '>
         <Link className={`w-[50%] h-[50px] mr-[1px] font-bold bg-[#636e72]  text-white grid place-content-center text-center rounded-[10px] cursor-pointer`} to="/books/sulakauri"><div>სულაკაური</div></Link>
         <Link className={`w-[50%] h-[50px]  font-bold bg-[#636e72]  text-white grid place-content-center text-center rounded-[10px] cursor-pointer`} to="/books/palitra"><div>პალიტრა</div></Link>
        </div>
        <div>
            <div className='grid place-content-center mb-[15px] text-[17px] '>ყველა გამომცემლობის წიგნები</div>
          <input type="text" onChange={(e) => setSearch(e.target.value)}  className='border-[1px]  px-[10px] py-[10px] w-[280px] rounded-[10px] border-black' placeholder='გაფილტვრა'  />
        </div>
      </div>
      <div className='mt-[10px]'>
      {state.map((d,index) => {
        return (
       <div onClick={() => navigate(`/person/${index}`)} key={index} className='bg-[#00b894] text-white text-bold rounded-[10px] p-[1%] text-center  w-[280px]  text-[17px] mt-[5px] flex flex-col  cursor-pointer'>
       <div className='text-center'> <p>{d.name} </p></div>
        <div className='flex mt-[10px] justify-between px-[1%]'>
            <p className=''>ფასი - {d.payPrice}ლ</p>
            <p>რაოდენობა -  {d.quantity}</p>
        </div>
        <div>გამომცემლობა - {d.description}</div>
      </div>
        )
      })
}
</div>
</div>
</>
  )
}

export default DebtMain