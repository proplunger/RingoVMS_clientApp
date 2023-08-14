import * as Yup from "yup";
const ErrorString = "This field is required";

export const contentLibValidation = Yup.object().shape({
    
    title: Yup.string().required(ErrorString),
    description: Yup.string().trim().required(ErrorString),
    contentTypeId:Yup.string().nullable().required(ErrorString),
    selectedClients: Yup.array().nullable().required(ErrorString)
});