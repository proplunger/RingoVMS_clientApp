import * as Yup from "yup";
import { AuthRoleType } from "../../../Shared/AppConstants";

const ErrorString = "This field is required";

export const userValidation = Yup.object().shape({
    userTypeId: Yup.string().required(ErrorString),
    lastName: Yup.string().required(ErrorString).trim().matches(/^[a-zA-Z'\-\. ]*$/, "Last Name is invalid"),
    firstName: Yup.string().required(ErrorString).trim().matches(/^[a-zA-Z'\-\. ]*$/, "First Name is invalid"),
    roleId: Yup.string().nullable().required(ErrorString),
    clientIds: Yup.array().nullable().ensure().when('userTypeId', {
        is: (val) => val==`${AuthRoleType.SystemAdmin}` || val==`${AuthRoleType.Client}`,
        then: Yup.array().required(ErrorString)
    }),
    vendorId: Yup.string().nullable().ensure().when('userTypeId', {
        is: `${AuthRoleType.Vendor}`,
        then: Yup.string().required(ErrorString)
    }),
    candidateId: Yup.string().nullable().ensure().when('userTypeId', {
        is: `${AuthRoleType.Provider}`,
        then: Yup.string().required(ErrorString)
    }),
    address: Yup.object().shape({
        email: Yup.string().email().nullable().required(ErrorString),
        contactNum1: Yup.string().required(ErrorString).test("len", "Mobile Number is invalid", (val) => val !=null && val.replace(/\D+/g, "").length ==10),
        contactNum2: Yup.string().test("len", "Phone Number is invalid", (val) => val !=null ? val.replace(/\D+/g, "").length > 0 ? val.replace(/\D+/g, "").length ==10 : true : true),
        pinCodeId: Yup.string().nullable().test("len", "Postal Code must be 5 digits long", (val) => val !=null ? val > 0 && val.length ==5 : true),
    })
});

