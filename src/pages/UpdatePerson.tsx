import React,{useContext,useState,useEffect} from 'react'
import { useNavigate,useParams } from 'react-router-dom'
import {Formik,Form} from "formik";
import * as Yup from "yup";
import Input from '../Reusable/form/input';
import { context } from '../store/store';
import useAxios from '../helper/useAxios';
import { toast } from 'react-toastify';

const validateSchema =  Yup.object({
    name: Yup.string().min(2,"მინიმუმ ორი ასო სახელი!").required("სახელი სავალდებულოა!"),
    surname: Yup.string().min(3,"მინიმუმ სამი ასო გვარი!").required("გვარი სავალდებულოა!"),
    money: Yup.string().required("თანხა სავალდებულოა!"),
    mobNumber: Yup.string(),
    info: Yup.string(),
  })
  
const UpdatePerson = () => {
    const navigate = useNavigate();
    const {personId} = useParams();
    const {persons,getPersons,userStatus,changeUserStatus} = useContext(context);
    const [state,setState] = useState(persons.filter(p => p._id.toString() === personId));
    const [submitStatus,setSubmitStatus] = useState(false);
    const {postData} = useAxios();
    useEffect(() => {
    setState(persons.filter(p => p._id.toString() === personId));
    },[persons])

    const submitHandler = async (values: {name: string,mobNumber: string,info: string,surname: string,money: number}) => {
      if(!userStatus || !localStorage.getItem("userStatus")) {
        changeUserStatus(false);
        navigate("/");
        toast.error("პაროლი შეიყვანეთ!");
     return;
    }
      setSubmitStatus(true);
        try{
            const api = await postData("https://natobackend.onrender.com/updatePerson",{...values,id: personId});
            getPersons();
            navigate("/");
            toast.success("დაემატა წარმატებით!");
           }catch(error) {
            toast.error("შეცდომაა, სცადეთ თავიდან!");
           console.log(error);
           }
           setSubmitStatus(false);
    }
  return (
    <div>
        <button onClick={() => navigate(`/person/${personId}`)} type="submit" className='border-[1px] bg-[#3498db] p-[10px] rounded-[12px] text-white mt-[10px] ml-[10px]'>უკან გასვლა</button>
        <div>
            {state.length > 0 ? (
              <div className='max-w-[270px] mx-auto mt-[30px]'>
                  <Formik
        initialValues={{
          name: state[0].name,
          mobNumber: state[0].mobNumber,
          surname: state[0].surname,
          info: state[0].info,
          money: state[0].money
        }}
        onSubmit={submitHandler}
        validationSchema={validateSchema}
        >
         <Form>
          <Input label='სახელი' name="name" id="name" type="text" placeholder='სახელი' />
          <Input label='გვარი' name="surname" id="surname" type="text" placeholder='გვარი' />
          <Input label='თანხა' name="money" id="money" type="number" placeholder='თანხა' />
          <Input label='ნომერი' name="mobNumber" id="mobNumber" type="number" placeholder='ნომერი' />
          <Input label='დამატებით ინფორმაცია' name="info" id="info" type="text" placeholder='დამატებით ინფორმაცია' />
          <div className='grid place-content-center'>
          <button disabled={submitStatus} type="submit" className='border-[1px] bg-[#2ecc71] p-[10px] rounded-[12px] text-white'>დამატება</button>
          </div> 
          </Form>
        </Formik>
                </div>
            ) : (
                <p>შეცდომაა,უკან გადაით და თავიდან სცადეთ!</p>
            )}
        </div>
    </div>
  )
}

export default UpdatePerson
