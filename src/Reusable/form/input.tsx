import React from 'react'
import {useField } from 'formik';

const Input: React.FC<{label: string,name: string, id: string, type: string, placeholder: string,step?: string,min?: string}> = ({label,...props}) => {
    const [Field,meta] = useField(props);
  return (
    <div className=' w-[100%] flex flex-col mb-[5px] '>
    <label className='text-[19px] mb-[5px]' htmlFor={props.id} >{label}:</label>
    <input  min="0.05" step="0.05" className='border-[1px] p-[7px] pt-[10px] rounded-[10px] border-black' {...Field} {...props} />
    {meta.touched && meta.error ? <p className='text-red-500' >{meta.error}</p> : <p className='text-white'>{"."}</p>}
    </div>
  )
}

export default Input