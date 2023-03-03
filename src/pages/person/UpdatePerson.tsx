import React,{useState,useEffect} from 'react'
import { useNavigate,useParams,Link } from 'react-router-dom'
import {Formik,Form} from "formik";
import * as Yup from "yup";
import Input from '../../Reusable/form/input';
import { getPersons } from '../../store/debts';
import useAxios from '../../helper/useAxios';
import { useAppDispatch,useAppSelector } from '../../store/reduxStore';
import { logOut } from '../../store/debts';
import {toast} from "react-toastify";
const validateSchema =  Yup.object({
    name: Yup.string().min(2,"მინიმუმ ორი ასო სახელი!").required("სახელი სავალდებულოა!"),
    surname: Yup.string().min(3,"მინიმუმ სამი ასო გვარი!").required("გვარი სავალდებულოა!"),
    money: Yup.string().required("თანხა სავალდებულოა!"),
    mobNumber: Yup.string(),
    personInfo: Yup.string(),
    updateInfo: Yup.string()
  })
  
const UpdatePerson = () => {
    const navigate = useNavigate();
    const {personId} = useParams();
    const {persons} = useAppSelector(state => state.persons);
    const dispatch = useAppDispatch();
    const [state,setState] = useState(persons.filter(p => p._id.toString() === personId));
    const [submitStatus,setSubmitStatus] = useState(false);
    const {postData} = useAxios();

    useEffect(() => {
    setState(persons.filter(p => p._id.toString() === personId));
    },[persons])

    const submitHandler = async (values: {name: string,mobNumber: string,personInfo: string,updateInfo: string,surname: string,money: number}) => {
      if(!localStorage.getItem("tokenShop")) {
        dispatch(logOut());
        navigate("/");
        toast.error("პაროლი შეიყვანეთ!");
     return;
    }
      setSubmitStatus(true);
        try{
           await postData("http://localhost:8080/updatePerson",{...values,id: personId});
            dispatch(getPersons({}));
            navigate("/persons");
            toast.success("დაემატა წარმატებით!");
           }catch(error) {
            toast.error("შეცდომაა, სცადეთ თავიდან!");
           console.log(error);
           }
           setSubmitStatus(false);
    }
  return (
    <div>
        <div className='flex justify-between items-center mt-[10px] '>
    <button onClick={() => navigate(`/person/${personId}`)} type="submit" className='border-[1px] bg-[#3498db] p-[10px] rounded-[12px] text-white ml-[10px]'>უკან გასვლა</button>
      <Link to="/" className='mr-[9px] text-gray-500'><p>დასაწყისი</p></Link> 
    </div>
        <div>
            {state.length > 0 ? (
              <div className='max-w-[270px] mx-auto mt-[30px]'>
                  <Formik
        initialValues={{
          name: state[0].name,
          mobNumber: state[0].mobNumber,
          surname: state[0].surname,
          personInfo: state[0].info,
          updateInfo: "",
          money: state[0].money
        }}
        onSubmit={submitHandler}
        validationSchema={validateSchema}
        >
         <Form>
          <Input label='სახელი' name="name" id="name" type="text" placeholder='სახელი' />
          <Input label='გვარი' name="surname" id="surname" type="text" placeholder='გვარი' />
          <Input label='ინფორმაცია ადამიანზე' name="personInfo" id="personInfo" type="text" placeholder='ინფორმაცია ადამიანზე' />
          <Input label='თანხა' name="money" id="money" type="number" placeholder='თანხა' />
          <Input label='ნომერი' name="mobNumber" id="mobNumber" type="number" placeholder='ნომერი' />
          <Input label='ინფორმაცია განახლებაზე' name="updateInfo" id="updateInfo" type="text" placeholder='ინფორმაცია განახლებაზე' />
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
