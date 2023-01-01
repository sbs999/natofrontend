import React from 'react'
import { useField } from 'formik'
const  Select: React.FC<{label: string,name: string, id: string,children: JSX.Element}> = ({label,...props}) => {
    const [Field,meta] = useField(props);
  return (
   <div className='mt-[10px]'>
   <label htmlFor={props.id} className="text-[18px] mb-[10px]" >{label}</label>
   <select  className='w-[100%]  h-[40px] rounded-[10px] border-[1px] border-black mt-[10px]' {...Field} {...props} >
    {props.children}
   </select>
   {meta.touched && meta.error ? <p className='text-red-500' >{meta.error}</p> : <p className='text-white'>{"."}</p>}
   </div>
  )
}

export default Select
