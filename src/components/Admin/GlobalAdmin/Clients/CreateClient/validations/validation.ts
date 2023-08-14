import * as Yup from "yup";
import { validMobile } from "../../../../../Shared/AppConstants";

const ErrorString = "This field is required";

export const clientValidation = Yup.object().shape({

    name: Yup.string().required(ErrorString).test("len", "Name should be of atleast 3 characters", (val) => val !=null ? val.length >= 3 : true).trim(),
    email: Yup.string().nullable().email(),
    phoneNumber: Yup.string().test("len", "Phone Number is invalid", (val) => { return validMobile(val) }),
    //phoneNumber: Yup.string().test("len", "Phone Number is invalid", (val) => val !=null ? val.replace(/\D+/g, "").length > 0 ? val.replace(/\D+/g, "").length ==10 : true : true),
    postalCode: Yup.string().nullable().matches(/^[0-9\b]*$/, "Invalid Postal Code").test("len", "Postal Code must be 5 or 9 digits long", (val) => val !=null ? val > 0 && (val.length ==5 || val.length ==9) : true),
});
