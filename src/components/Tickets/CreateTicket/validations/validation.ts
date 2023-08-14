import * as Yup from "yup";

const ErrorString = "This field is required";

export const ticketValidation = Yup.object().shape({

    title: Yup.string().required(ErrorString).test("len", "Title should be of atleast 3 characters", (val) => val !=null ? val.length >= 3 : true).trim(),
    // tktFunctionAreaId: Yup.string().nullable().required(ErrorString),
    tktRequestTypeId: Yup.string().nullable().required(ErrorString),
    tktPriorityId: Yup.string().nullable().required(ErrorString),
});
