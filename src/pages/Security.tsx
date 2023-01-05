import React from 'react'
import { toast } from 'react-toastify';
import {Formik,Form} from "formik";
import * as Yup from "yup";
import Input from '../Reusable/form/input';
import useAxios from '../helper/useAxios';
import { useNavigate } from 'react-router-dom';
import { login,logOut } from '../store/debts';
import { useAppDispatch } from '../store/reduxStore';
const validateSchema =  Yup.object({
    password: Yup.string().required("პაროლი სავალდებულოა!")
  })

const Security = () => {
    const {postData} = useAxios();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const submitHandler = async (values: {password: string}) => {
        try{
            const api = await postData("http://localhost:8080/signIn",values);
            localStorage.setItem("tokenShop",api.token);
            dispatch(login());
             navigate("/");
           }catch(error) {
            toast.error("შეცდომაა, სცადეთ თავიდან!");
           console.log(error);
           }
      setTimeout(() => {
         localStorage.removeItem("tokenShop");
         dispatch(logOut());
         navigate("/");
      },3600000)
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

