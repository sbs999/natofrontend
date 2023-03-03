import React,{useEffect,useState} from 'react'
import { useNavigate,Link,useParams } from 'react-router-dom'
import { useAppSelector } from '../../../store/reduxStore';
import {Formik,Form} from "formik";
import * as Yup from "yup";
import Input from '../../../Reusable/form/input';
const validateSchema =  Yup.object({
    quantity: Yup.string().required("სავალდებულოა რაოდენობა!"),
  })
  

const EachSulakauriBook = () => {
    const navigate = useNavigate();
    const {sulakauriBooks} = useAppSelector(state => state.books);
    const {bookId} = useParams();
    const [state,setState] = useState(sulakauriBooks.filter(p => p.code.toString() === bookId?.toString()));
    const [submitStatus,setSubmitStatus] = useState(false);
    useEffect(() => {
        setState(sulakauriBooks.filter(p => p.code === bookId));
     },[sulakauriBooks])

 const submitHandler = (value: {quantity: string}) => {
    const postData = {quantity: value.quantity,code: state[0].code};
     console.log(postData);
 }
  return (
    <div>
       <div className='flex justify-between items-center mt-[10px] '>
    <button onClick={() => navigate("/books/sulakauri")} type="submit" className='border-[1px] bg-[#3498db] p-[10px] rounded-[12px] text-white ml-[10px]'>უკან გასვლა</button>
      <Link to="/" className='mr-[9px] text-gray-500'><p>დასაწყისი</p></Link> 
    </div>
        {state.length <= 0 ? (
         <div className='mt-[50px]'>შეცდომაა,თავიდან სცადეთ! არა არის ასეთი წიგნი!</div>
        ) : (
            <>
            <div className='mx-[2%] mt-[25px] text-[19px]'>
                <p className='my-[8px]'>დასახლება - {state[0].name}</p>
                <p className='mb-[8px]'>გასაყიდი ფასი - {state[0].payPrice}ლ</p>
                <p className='mb-[8px]'>რაოდენობა - {state[0].quantity} ცალი</p>
                <p className='mb-[8px]'>კოდი - {state[0].code}</p>
            </div>
             
             <div className='max-w-[270px] mx-auto mt-[40px] '>
             <Formik
      initialValues={{
        quantity: ""
      }}
      onSubmit={submitHandler}
      validationSchema={validateSchema}
      >
       <Form>
        <Input min="1" step="1" label='რაოდენობა' name="quantity" id="quantity" type="number" placeholder='რაოდენობა' />
        <div className='grid place-content-center'>
        <button disabled={submitStatus} type="submit" className='border-[1px] bg-[#2ecc71] p-[10px] px-[15px] rounded-[12px] text-black'>გაიყიდა</button>
        </div> 
        </Form>
      </Formik>
             </div>
            </>
        )}
    </div>
  )
}

export default EachSulakauriBook
