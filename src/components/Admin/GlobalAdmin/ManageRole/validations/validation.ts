import * as Yup from "yup";

const ErrorString = "This field is required";

export const roleValidation = Yup.object().shape({
    
    name: Yup.string().required(ErrorString),
    description: Yup.string().trim().required(ErrorString),
});