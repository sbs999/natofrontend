import React, { useState,useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../../store/reduxStore';
const Palitra = () => {
    const navigate = useNavigate();
    const [search,setSearch] = useState("");
    const [bookStatus,setBookStatus] = useState("current");
    const {PalitraBooks} = useAppSelector(state => state.books)
    const [currentBooks,setCurrentBooks] = useState(PalitraBooks);

    useEffect(() => {
      setCurrentBooks(PalitraBooks);
    },[PalitraBooks])
  
    useEffect(() => {
      if(search) {
     const filteredInfo = PalitraBooks.filter(a =>
      [a.name.replaceAll(' ', ''), a.code]
          .join('')
          .toLowerCase()
          .includes(search.toString().toLocaleLowerCase().split(' ').join(''))
      );
      setCurrentBooks(filteredInfo as []);
     }else{
      setCurrentBooks(PalitraBooks);
     }
    },[search])
  return (
    <>
    <div className='flex justify-between items-center mt-[10px] '>
    <button onClick={() => navigate("/books")} type="submit" className='border-[1px] bg-[#3498db] p-[10px] rounded-[12px] text-white ml-[10px]'>უკან გასვლა</button>
      <Link to="/" className='mr-[9px] text-gray-500'><p>დასაწყისი</p></Link> 
    </div>
    <div className='flex justify-center flex-col items-center mt-[15px]'>
        <div  className='text-[20px]'>გამომცემლობა პალიტრა</div>
        <div onClick={() => navigate("/books/palitra/addbooks")} className='mt-[10px] text-gray-500 cursor-pointer text-[18px]'>წიგნების დამატება</div>
        <div className='mt-[5px] text-gray-500 cursor-pointer text-[18px]'>წიგნების აღწერა</div>
      <div className='mt-[20px]'>
      <div className='flex max-w-[300px] mx-auto rounded-[10px] justify-between mb-[20px] '>
        <div onClick={() => {setBookStatus("current"); setSearch("")}}  className={` ${bookStatus === "current" ? 'bg-green-500' : "bg-red-500"} w-[50%]  mr-[1px] font-bold  text-white grid place-content-center text-center rounded-[10px] cursor-pointer`}>წიგნების სია</div>
        <div onClick={() => {setBookStatus("sale"); setSearch("")}} className={` ${bookStatus === "sale" ? 'bg-green-500' : "bg-red-500"} w-[50%] text-center  font-bold text-white grid place-content-center rounded-[10px] cursor-pointer`}>გაყიდული წიგნების სია</div>
        </div>
        <div>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}  className='border-[1px]  px-[10px] py-[10px] w-[280px] rounded-[10px] border-black' placeholder='გაფილტვრა'  />
        </div>
      </div>
      <div className='mt-[10px]'>
        {bookStatus === 'current' ? (
            <>
             {currentBooks.map((d,index) => {
        return (
       <div onClick={() => navigate(`/person/${index}`)} key={index} className='bg-[#00b894] text-white text-bold rounded-[10px] p-[1%] text-center  w-[280px]  text-[17px] mt-[5px] flex flex-col  cursor-pointer'>
       <div className='text-center'> <p>{d.name} </p></div>
        <div className='flex mt-[10px] justify-between px-[1%]'>
            <p className=''>ფასი - {d.payPrice}ლ</p>
            <p>რაოდენობა -  {d.quantity}</p>
        </div>
      </div>
        )
      })
}
            </>
        ) : (
            <>
            {[{name: "ბებერი მგელი და წითელქუდაას ზღაპრები!",money: 15.43,quantity: 1},{name: "ბებერი მგელი",money: 15.43,quantity: 3},{name: "ბებერი მგელი და წითელქუდაას ზღაპრები! და ანონი!",money: 15.43,quantity: 1}].map((d,index) => {
       return (
      <div onClick={() => navigate(`/person/${index}`)} key={index} className='bg-[#00b894] text-white text-bold rounded-[10px] p-[1%] text-center  w-[280px]  text-[17px] mt-[5px] flex flex-col  cursor-pointer'>
      <div className='text-center'> <p>{d.name} </p></div>
       <div className='flex mt-[10px] justify-between px-[1%]'>
           <p className=''>ფასი - {d.money}ლ</p>
           <p>რაოდენობა -  {d.quantity}</p>
       </div>
     </div>
       )
     })
}
           </>
        )}
     
</div>
</div>
</>
  )
}

export default Palitra
