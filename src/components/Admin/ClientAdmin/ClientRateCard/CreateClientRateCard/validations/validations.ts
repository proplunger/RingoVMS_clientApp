import * as Yup from "yup";

const ErrorString = "This field is required";

export const clientRateCardValidation = Yup.object().shape({
    
    // divisionId: Yup.string().nullable().required(ErrorString),
    // locationId: Yup.string().nullable().required(ErrorString),
    // jobCategoryId: Yup.string().nullable().required(ErrorString),
    // positionId: Yup.string().nullable().required(ErrorString),
    selectedDivisions: Yup.string().nullable().required(ErrorString),
    selectedLocations: Yup.string().nullable().required(ErrorString),
    selectedJobCategory: Yup.string().nullable().required(ErrorString),
    selectedPositions: Yup.string().nullable().required(ErrorString),
    serviceTypeId: Yup.string().nullable().required(ErrorString),
    serviceCategoryId: Yup.string().nullable().required(ErrorString),
    billTypeId: Yup.string().nullable().required(ErrorString),
    maxBillRate: Yup.string().nullable().required(ErrorString).test("len", "Max Bil Rate value should be less than or equal to 99999", (val) => val !=null && val <= 99999),
    suppress: Yup.string().nullable().test("len", "Suppress value should be less than 100", (val) => val !=null ? val < 100 : true),
    maxHolidayBillRate: Yup.string().nullable().required(ErrorString).test("len", "Max Holiday Bil Rate value should be less than or equal to 99999", (val) => val !=null && val <= 99999),
    validFrom: Yup.date().required(ErrorString),
    validTo: Yup.date().required(ErrorString).min(Yup.ref('validFrom'), "valid To can't be before valid From"),
    // validFrom: Yup.date().required(ErrorString).default(() => new Date()),
    // validTo: Yup.date().required(ErrorString).when("validFrom",(validFrom, schema) => validFrom && schema.min(validFrom+1))
});