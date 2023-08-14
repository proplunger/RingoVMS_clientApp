import * as React from "react";
import { SchedulerEditItem, SchedulerSlot, SchedulerSlotProps } from "@progress/kendo-react-scheduler";

export const EditItemWithDynamicTitle = (props) => {
   return <SchedulerEditItem {...props} title={generateTitle(props.dataItem)} />;
};

const generateTitle = (dataItem) => {
  const Title = dataItem.title;
  return `${Title}`;
};

export const CustomSlot = (props: SchedulerSlotProps) => {

  const handleDataChange = (event) => {
    event.syntheticEvent.preventDefault();    
  };

  return new Date(props.start) < new Date() ? (
    <SchedulerSlot {...props} onDoubleClick={handleDataChange} style = {{backgroundColor:"#f1f1f1"}}/>
  ) : (
    <SchedulerSlot {...props} style = {{cursor:"pointer"}}/>
  );
};