import * as Yup from "yup";

const ErrorString = "This field is required";

export const requisitionValidation = Yup.object().shape({
    clientDivisionId: Yup.string().nullable().required(ErrorString),
    divisionLocationId: Yup.string().nullable().required(ErrorString),
    clientContactNum: Yup.string()
        .required(ErrorString)
        .test("len", "Client Contact Number is invalid", (val) => val !=null && val.replace(/\D+/g, "").length ==10),
    reasonId: Yup.string().nullable().required(ErrorString),
    justification: Yup.string().trim().nullable().required(ErrorString),
    //purchaseOrder: Yup.string().max(50),
    reqPosition: Yup.object().shape({
        jobWf: Yup.object({
            id: Yup.string().nullable().required(ErrorString),
        }),
        jobCategory: Yup.object({
            id: Yup.string().nullable().required(ErrorString),
        }),
        jobPosition: Yup.object({
            id: Yup.string().nullable().required(ErrorString),
        }),
        noOfReqStaff: Yup.number()
            .nullable()
            .required(ErrorString)
            .max(999, "No of required staff cannot be greater than 999")
            .min(1, "No of required staff cannot be less than 1"),
        assignType: Yup.object({
            id: Yup.string().nullable().required(ErrorString),
        }),
        hiringManager: Yup.object({
            id: Yup.string().nullable().required(ErrorString),
        }),
        startDate: Yup.date().nullable().required(ErrorString),
        endDate: Yup.date().nullable().required(ErrorString),
        positionSkillMapping: Yup.array().nullable().required(ErrorString),
        positionDesc: Yup.string().trim().required(ErrorString),
        
    }),
    departmentId: Yup.string().nullable().ensure().when('isEnableDepartment', {
        is: true,//(isEnableDepartment) => isEnableDepartment==true,
        then: Yup.string().required(ErrorString),
        otherwise: Yup.string().nullable()
    }),
});

export const validate = (values) => {
    const errors = { username: "", email: "", age: "" };
    if (!values.username) {
        errors.username = "Required";
    } else if (values.username.length > 15) {
        errors.username = "Must be 15 characters or less";
    }
    if (!values.email) {
        errors.email = "Required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = "Invalid email address";
    }
    if (!values.age) {
        errors.age = "Required";
    } else if (isNaN(Number(values.age))) {
        errors.age = "Must be a number";
    } else if (Number(values.age) < 18) {
        errors.age = "Sorry, you must be at least 18 years old";
    }
    return errors;
};
