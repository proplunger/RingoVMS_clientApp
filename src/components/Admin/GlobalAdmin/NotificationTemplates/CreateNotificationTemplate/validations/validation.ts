import * as Yup from "yup";

const ErrorString = "This field is required";

export const notificationTemplateValidation = Yup.object().shape({   

    notificationTypeId: Yup.string().nullable().required(ErrorString),
    notificationMediumId: Yup.string().nullable().required(ErrorString),
    subject: Yup.string().nullable().required(ErrorString),
    body: Yup.string().nullable().required(ErrorString),
    distributionType: Yup.string().nullable().required(ErrorString),
    to: Yup.array().nullable().required(ErrorString),
    cc: Yup.array().nullable().required(ErrorString),
    bcc: Yup.array().nullable().required(ErrorString),
});