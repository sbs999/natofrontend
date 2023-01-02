import React,{useContext} from 'react'
import { toast } from 'react-toastify';
import {Formik,Form} from "formik";
import * as Yup from "yup";
import Input from '../Reusable/form/input';
import useAxios from '../helper/useAxios';
import { useNavigate } from 'react-router-dom';
import { context } from '../store/store';
const validateSchema =  Yup.object({
    password: Yup.string().required("პაროლი სავალდებულოა!")
  })

const Security = () => {
    const {postData} = useAxios();
    const navigate = useNavigate();
    const {userStatus,changeUserStatus} = useContext(context);
    const submitHandler = async (values: {password: string}) => {
        try{
            const api = await postData("https://natobackend.onrender.com/signIn",values);
            changeUserStatus(true);
             navigate("/");
           }catch(error) {
            toast.error("შეცდომაა, სცადეთ თავიდან!");
           console.log(error);
           }
    }
  return (
    <div className='mt-[100px] max-w-[280px] mx-auto'>
    <Formik
    initialValues={{
      password: ""
    }}
    onSubmit={submitHandler}
    validationSchema={validateSchema}
    >
     <Form>
      <Input label='პაროლი' name="password" id="password" type="number" placeholder='პაროლი' />
      <div className='grid place-content-center'>
      <button  type="submit" className='border-[1px] bg-[#2ecc71] p-[10px] rounded-[12px] text-white'>შესვლა</button>
      </div> 
      </Form>
    </Formik>
    </div>
  )
}

export default Security

