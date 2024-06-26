import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "../../Reusable/form/input";
import useAxios from "../../helper/useAxios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import { useAppDispatch } from "../../store/reduxStore";
import { logOut } from "../../store/debts";
import { getPersons } from "../../store/debts";

interface PersonType {
  name: string;
  surname: string;
  money: string;
  personInfo: string;
  debtInfo: string;
  mobNumber?: string;
}
const validateSchema = Yup.object({
  name: Yup.string()
    .min(2, "მინიმუმ ორი ასო სახელი!")
    .required("სახელი სავალდებულოა!"),
  surname: Yup.string()
    .min(3, "მინიმუმ სამი ასო გვარი!")
    .required("გვარი სავალდებულოა!"),
  money: Yup.string().required("თანხა სავალდებულოა!"),
  mobNumber: Yup.string(),
  personInfo: Yup.string(),
  debtInfo: Yup.string(),
});

const AddFormSchema: React.FC<{
  histroyStatus: { status: string; id: string };
  name: string;
  mobNumber: string;
  surname: string;
  info: string;
}> = ({ histroyStatus, name, mobNumber, surname, info }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { postData } = useAxios();
  const [submitStatus, setSubmitStatus] = useState(false);

  const submitHandler = async (values: PersonType) => {
    if (!localStorage.getItem("mixToken")) {
      dispatch(logOut());
      navigate("/");
      toast.error("პაროლი შეიყვანეთ!");
      return;
    }
    setSubmitStatus(true);
    try {
      await postData(`addPerson`, {
        ...values,
        name: values.name.trim(),
        surname: values.surname.trim(),
        money: +values.money,
        histroyStatus: histroyStatus,
      });
      // info: values.info?.trim(),
      dispatch(getPersons({}));
      navigate("/");
      toast.success("დაემატა წარმატებით!");
    } catch (error) {
      toast.error("შეცდომაა, სცადეთ თავიდან!");
      console.log(error);
    }
    setSubmitStatus(false);
  };

  return (
    <Formik
      initialValues={{
        name: name,
        mobNumber: mobNumber,
        surname: surname,
        personInfo: info,
        debtInfo: "",
        money: "",
      }}
      onSubmit={submitHandler}
      validationSchema={validateSchema}
    >
      <Form>
        <Input
          label="სახელი"
          name="name"
          id="name"
          type="text"
          placeholder="სახელი"
        />
        <Input
          label="გვარი"
          name="surname"
          id="surname"
          type="text"
          placeholder="გვარი"
        />
        <Input
          label="ინფორმაცია ადამიანზე"
          name="personInfo"
          id="personInfo"
          type="text"
          placeholder="დამატებითი ინფორმაცია"
        />
        <Input
          label="თანხა"
          name="money"
          id="money"
          type="number"
          placeholder="თანხა"
        />
        <Input
          label="ინფორმაცია ვალზე"
          name="debtInfo"
          id="debtInfo"
          type="text"
          placeholder="დამატებითი ინფორმაცია"
        />
        <Input
          label="ნომერი"
          name="mobNumber"
          id="mobNumber"
          type="number"
          placeholder="ნომერი"
        />
        <div className="grid place-content-center">
          <button
            disabled={submitStatus}
            type="submit"
            className="border-[1px] bg-[#2ecc71] p-[10px] rounded-[12px] text-white"
          >
            დამატება
          </button>
        </div>
      </Form>
    </Formik>
  );
};
export default AddFormSchema;
