import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "../../Reusable/form/input";
import useAxios from "../../helper/useAxios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../store/reduxStore";
import { getPersons, logOut } from "../../store/debts";
import Select from "../../Reusable/form/Select";
import { useState } from "react";

const validateSchema = Yup.object({
  status: Yup.string().oneOf(["add", "pay"]).required("სავალდებულოა!"),
  money: Yup.string().required("სავალდებულოა თანხა!"),
  info: Yup.string(),
});

const EachPersonForm: React.FC<{ id: string }> = ({ id }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { postData } = useAxios();
  const [submitStatus, setSubmitStatus] = useState(false);
  const backendUrl =
    process.env.REACT_APP_PORT || "https://natobackend.onrender.com";

  const submitHandler = async (values: {
    info: string;
    status: string;
    money: string;
  }) => {
    if (!localStorage.getItem("tokenShop")) {
      dispatch(logOut());
      navigate("/");
      toast.error("პაროლი შეიყვანეთ!");
      return;
    }

    setSubmitStatus(true);

    const url =
      values.status === "add"
        ? `${backendUrl}/addMoney`
        : `${backendUrl}/payMoney`;

    try {
      await postData(url, { money: +values.money, id: id, info: values.info });
      dispatch(getPersons({}));
      navigate("/");
      toast.success("ქმედება წარმატებულია! :)");
    } catch (error) {
      toast.error("შეცდომაა, სცადეთ თავიდან!");
      console.log(error);
    }

    setSubmitStatus(false);
  };

  return (
    <Formik
      initialValues={{
        status: "",
        info: "",
        money: "",
      }}
      onSubmit={submitHandler}
      validationSchema={validateSchema}
    >
      <Form>
        <Select label="ვალს ამატებს თუ იხდის ?" name="status" id="status">
          <>
            <option value=""></option>
            <option value="add">ვალის დამატება</option>
            <option value="pay">ვალის გადახდა</option>
          </>
        </Select>
        <Input
          label="თანხა"
          name="money"
          id="money"
          type="number"
          placeholder="თანხა"
        />
        <Input
          label="დამატებით ინფორმაცია"
          name="info"
          id="info"
          type="text"
          placeholder="დამატებით ინფორმაცია"
        />
        <div className="grid place-content-center">
          <button
            disabled={submitStatus}
            type="submit"
            className="border-[1px] bg-[#2ecc71] p-[10px] px-[15px] rounded-[12px] text-black"
          >
            შენახვა
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default EachPersonForm;
