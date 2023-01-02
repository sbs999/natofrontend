import {Formik,Form,Field} from "formik";
import * as Yup from "yup";
import Input from "../../Reusable/form/input";
import useAxios from "../../helper/useAxios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { context } from "../../store/store";
import { useContext } from "react";
import Select from "../../Reusable/form/Select";
import { useState } from "react";
const validateSchema =  Yup.object({
  status: Yup.string()
  .oneOf(
    ['add', 'pay']
  )
  .required('სავალდებულოა!'),
  money: Yup.string().required("სავალდებულოა თანხა!"),
  info: Yup.string(),
})

const EachPersonForm: React.FC<{id: string}> = ({id}) => {
  const {getPersons,userStatus,changeUserStatus} = useContext(context);
    const navigate = useNavigate();
    const {postData} = useAxios();
    const [submitStatus,setSubmitStatus] = useState(false);
    const submitHandler = async (values: {info: string,status: string,money: string}) => {
      if(!userStatus) {
        changeUserStatus(false);
        navigate("/");
        toast.error("პაროლი შეიყვანეთ!");
     return;
    }
      setSubmitStatus(true);
      const url = values.status === "add" ? 'https://natobackend.onrender.com/addMoney': "https://natobackend.onrender.com/payMoney";
       try{
        const api = await postData(url,{money: +values.money,id: id,info: values.info});
        getPersons();
         navigate("/");
         toast.success("ქმედება წარმატებულია! :)");
       }catch(error) {
        toast.error("შეცდომაა, სცადეთ თავიდან!");
       console.log(error);
       }
       setSubmitStatus(false);
    }
  return (
    <Formik
      initialValues={{
        status: "",
        info: "",
        money: ""
      }}
      onSubmit={submitHandler}
      validationSchema={validateSchema}
      >
       <Form>
       <Select label="ვალს ამატებს თუ იხდის ?" name="status" id="status" >
        <>
               <option value=""></option>
               <option value="add">ვალის დამატება</option>
               <option value="pay">ვალის გადახდა</option>
        </>
        </Select>
        <Input label='თანხა' name="money" id="money" type="number" placeholder='თანხა' />
        <Input label='დამატებით ინფორმაცია' name="info" id="info" type="text" placeholder='დამატებით ინფორმაცია' />
        <div className='grid place-content-center'>
        <button disabled={submitStatus} type="submit" className='border-[1px] bg-[#2ecc71] p-[10px] px-[15px] rounded-[12px] text-black'>შენახვა</button>
        </div> 
        </Form>
      </Formik>
  )
}

export default EachPersonForm

