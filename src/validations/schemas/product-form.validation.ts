import * as Yup from "yup";

export const productFormValidateSchema = Yup.object({
  name: Yup.string()
    .min(3, "მინიმუმ სამი ასო სახელი!")
    .required("სახელი სავალდებულოა!"),
  description: Yup.string().min(3, "მინიმუმ სამი ასო გვარი!"),
});
