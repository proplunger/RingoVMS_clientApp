import * as Yup from "yup";
import { validMobile } from "../../../../../Shared/AppConstants";

const ErrorString = "This field is required";

export const candidateValidation = Yup.object().shape({

    firstName: Yup.string().required(ErrorString).trim().matches(/^[a-zA-Z'\-\. ]*$/, "First Name is invalid"),
    lastName: Yup.string().required(ErrorString).trim().matches(/^[a-zA-Z'\-\. ]*$/, "Last Name is invalid"),
    jobCategoryId: Yup.string().nullable().required(ErrorString),
    jobTitleId: Yup.string().nullable().required(ErrorString),
    ssn: Yup.string().nullable().matches(/^[0-9]+$/, 'SSN is invalid').test("len", "SSN must be 9 digits long", (val) => val !=null ? val > 0 && val.length ==9 : true).trim(),
    //npi: Yup.string().nullable().test("len", "NPI must be 10 digits long", (val) => val !=null ? val > 0 && val.length ==10 : true),
    npi: Yup.string().nullable().ensure().when('isNpiRequired', {
        is: true,//(isNpiRequired) => isNpiRequired==true,
        then: Yup.string().required(ErrorString).test("len", "NPI must be 10 digits long", (val) => val !=null ? parseInt(val) >= 0 && val.length ==10 : true),
        otherwise: Yup.string().nullable().test("len", "NPI must be 10 digits long", (val) => val !=null ? parseInt(val) >= 0 ? val.length ==10 : true : true)
    }),
    email: Yup.string().email().nullable(),
    mobileNumber: Yup.string().test("len", "Mobile Number is invalid", (val) => { return validMobile(val) }),
    phoneNumber: Yup.string().test("len", "Phone Number is invalid", (val) => { return validMobile(val) }),
    //phoneNumber: Yup.string().test("len", "Phone Number is invalid", (val) => val !=null ? val.replace(/\D+/g, "").length > 0 ? val.replace(/\D+/g, "").length ==10 : true : true),
    address1: Yup.string().required(ErrorString).trim(),
    cityId: Yup.string().nullable().required(ErrorString),
    stateId: Yup.string().nullable().required(ErrorString),
    postalCode: Yup.string().nullable().required(ErrorString).matches(/^[0-9\b]*$/, "Invalid Postal Code").test("len", "Postal Code must be 5 or 9 digits long", (val) => val !=null && val > 0 && (val.length ==5 || val.length ==9)),
    countryId: Yup.string().nullable().required(ErrorString),
    selectedSkills: Yup.array().nullable().required(ErrorString),
});

// function validMobile(val){
//     if (val !=null) {
//         val = val.substring(0, 14);
//         if (val.replace(/\D+/g, "").length > 0) {
//             return (val.replace(/\D+/g, "").length ==10)
//         } else {
//             return true;
//         }
//     }
//     else {
//         return true
//     }
// }

