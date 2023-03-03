import React from 'react'
import { Link } from 'react-router-dom'



const Navbar = () => {
  

  return (
    <div className='grid place-content-center mt-[150px]'>
        <div className='flex'>
      <Link to="/persons"><div className='text-[25px] bg-[#1abc9c] w-[120px] p-[5px]  grid place-content-center rounded-[10px] text-white mr-[20px]'><p>ვალები</p></div></Link>
      <Link to="/books"><div className='text-[25px] bg-[#1abc9c] w-[120px] p-[5px]  grid place-content-center rounded-[10px] text-white'><p>წიგნები</p></div></Link>
      </div>
    </div>
  )
}

export default Navbar
