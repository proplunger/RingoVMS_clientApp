import * as Yup from "yup";

const ErrorString = "This field is required";

export const messageValidation = Yup.object().shape({
  message: Yup.string().required(ErrorString),
  topic: Yup.string().required(ErrorString),
  msgPrioId: Yup.string().required(ErrorString),
  msgCatId: Yup.string().required(ErrorString),
  // usersAndRoles: Yup.string().nullable().required(ErrorString),
  // userId: Yup.string().nullable().required(ErrorString),
  endDateTime: Yup.string().required(ErrorString)
  // clientIds: Yup.string().nullable().required(ErrorString),
  // userTypeId: Yup.string().nullable().required(ErrorString)
});
