import * as Yup from "yup";
import { validMobile } from "../../../../../Shared/AppConstants";

const ErrorString = "This field is required";

export const vendorTierValidation = Yup.object().shape({

    selectedDivisions: Yup.string().nullable().required(ErrorString),
    selectedLocations: Yup.string().nullable().required(ErrorString),
    vendorId: Yup.string().nullable().required(ErrorString),
    vendorTierId: Yup.string().nullable().required(ErrorString),
});