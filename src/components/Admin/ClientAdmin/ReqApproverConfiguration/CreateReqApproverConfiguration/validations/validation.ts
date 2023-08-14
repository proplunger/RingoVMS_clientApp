import * as Yup from "yup";

const ErrorString = "This field is required";

export const reqApproverConfigValidation = Yup.object().shape({
    
        selectedDivisions: Yup.string().nullable().required(ErrorString),
        selectedLocations: Yup.string().nullable().required(ErrorString),
        selectedJobCategory: Yup.string().nullable().required(ErrorString),
        selectedPositions: Yup.string().nullable().required(ErrorString),
});