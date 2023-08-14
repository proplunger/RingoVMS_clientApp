import * as React from "react";
import {
  SchedulerForm,
  useSchedulerFieldsContext,
  SchedulerFormEditor,
} from "@progress/kendo-react-scheduler";

import { Error, Label } from "@progress/kendo-react-labels";
import { Input } from "@progress/kendo-react-inputs";

import { Dialog } from "@progress/kendo-react-dialogs";
import { TITLE_TEXT } from "../AppMessages";
import { parseAdjust } from "../../../HelperMethods";

export const CustomDialog = (props) => {
  return <Dialog {...props} title={"Select Time"} />;
};

function trim(stringToTrim) {
  return stringToTrim.replace(/^\s+|\s+$/g, "");
}
const LazyError = (props) => {
  return props.visited ? <Error {...props} /> : null;
};
const titleEditor = (props) => {
  if (
    props.visited ==undefined &&
    props.value ==undefined &&
    props.onChange
  ) {
    props.onChange.call(undefined, { value: TITLE_TEXT });
  }
  const handleChange = (event) => {
    if (props.onChange) {
      props.onChange.call(undefined, { value: event.value });
    }
  };
  const formatInput = (event) => {
    if (props.onBlur) {
      props.onBlur.call(undefined, { value: trim(event.target.value) });
    }
  };
  document.getElementsByName("start").length>0 && (document.getElementsByName("start")[0]["disabled"]=true)
  document.getElementsByName("end").length>0 && (document.getElementsByName("end")[0]["disabled"]=true)
  return (
    <Input value={props.value} maxLength={50} onChange={handleChange} onBlur={formatInput} />
  );
};

const CustomFormEditor = (props) => {
  return (
    <SchedulerFormEditor
      {...props}
      titleError={LazyError}
      descriptionError={LazyError}
      titleEditor={titleEditor}
    />
  );
};

export const FormWithAdditionalValidation = (props) => {
  const fields = useSchedulerFieldsContext();

  const requiredValidator = React.useCallback(
    (value) => (!value ? "Field is required." : undefined),
    []
  );

  const titleLengthValidator = React.useCallback((title) => {
    let titleValue = title != undefined ? trim(title) : title;
    return !titleValue || titleValue.length < 4
      ? "The title should be at least 4 characters."
      : undefined;
  }, []);

  const customValidator = React.useCallback(
    (_dataItem, formValueGetter) => {
      let result = {};

      result[fields.title] = [
        requiredValidator(formValueGetter(fields.title)),
        titleLengthValidator(formValueGetter(fields.title)),
      ]
        .filter(Boolean)
        .reduce((current, acc) => current || acc, "");
      return result;
    },
    [fields, requiredValidator, titleLengthValidator]
  );

  return (
    <SchedulerForm
      {...props}
      reccurence={false}
      validator={customValidator}
      editor={CustomFormEditor}
      dialog={CustomDialog}
    />
  );
};


export const getTaskData = (initialData) => {
  const data =
    initialData.length > 0
      ? initialData.map((data) => {
        let dataItem = JSON.parse(data.slot);
        let recurrenceExceptions =
          dataItem.recurrenceExceptions ==undefined ||
            dataItem.recurrenceExceptions ==null
            ? null
            : dataItem.recurrenceExceptions.map((i) => parseAdjust(i));
        return {
          end: parseAdjust(dataItem.end),
          id: dataItem.id,
          isAllDay:
            dataItem.isAllDay ==undefined ? null : dataItem.isAllDay,
          start:
            parseAdjust(dataItem.start) ==undefined
              ? null
              : parseAdjust(dataItem.start),
          title: dataItem.title ==undefined ? null : dataItem.title,
          startTimezone:
            dataItem.startTimezone ==undefined
              ? null
              : dataItem.startTimezone,
          endTimezone:
            dataItem.endTimezone ==undefined
              ? null
              : dataItem.endTimezone,
          description:
            dataItem.description ==undefined
              ? null
              : dataItem.description,
          recurrenceRule:
            dataItem.recurrenceRule ==undefined
              ? null
              : dataItem.recurrenceRule,
          ocurrenceId:
            dataItem.ocurrenceID ==undefined
              ? null
              : dataItem.ocurrenceId,
          recurrenceExceptions: recurrenceExceptions,
        };
      })
      : [];

  return data;
};
