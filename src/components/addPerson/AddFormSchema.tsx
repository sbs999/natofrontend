import {Formik,Form} from "formik";
import * as Yup from "yup";
import Input from "../../Reusable/form/input";
import useAxios from "../../helper/useAxios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { context } from "../../store/store";
import { useContext, useState } from "react";

interface PersonType {
  name: string,
  surname: string,
  money: string,
  info?: string,
  mobNumber?: string
}
const validateSchema =  Yup.object({
    name: Yup.string().min(2,"მინიმუმ ორი ასო სახელი!").required("სახელი სავალდებულოა!"),
    surname: Yup.string().min(3,"მინიმუმ სამი ასო გვარი!").required("გვარი სავალდებულოა!"),
    money: Yup.string().required("თანხა სავალდებულოა!"),
    mobNumber: Yup.string(),
    info: Yup.string(),
  })
  
  const AddFormSchema: React.FC<{histroyStatus: {status: string,id: string},name: string,mobNumber: string,surname:string,info: string}> = ({histroyStatus,name,mobNumber,surname,info}) => {
    const {getPersons,userStatus,changeUserStatus} = useContext(context);
    const navigate = useNavigate();
    const {postData} = useAxios();
    const [submitStatus,setSubmitStatus] = useState(false);
    const submitHandler = async (values: PersonType) => {
     
      if(!userStatus || !localStorage.getItem("userStatus")) {
        changeUserStatus(false);
        navigate("/");
        toast.error("პაროლი შეიყვანეთ!");
     return;
    }
        setSubmitStatus(true);
       try{
        const api = await postData("https://natobackend.onrender.com/addPerson",{...values,name: values.name.trim(),surname: values.surname.trim(),info: values.info?.trim(),money: +values.money,histroyStatus: histroyStatus});
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
        <Formik
        initialValues={{
          name: name,
          mobNumber: mobNumber,
          surname: surname,
          info: info,
          money: ""
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
    )
  }
export default AddFormSchema