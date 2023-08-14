import {connect, FormikContextType} from "formik";
import {Component} from "react";

export interface IProps {
    formik: FormikContextType<any>;
}

class ErrorFocusInternal extends Component<IProps> {
    public componentDidUpdate(prevProps: IProps) {
        let errorElemnts = document.getElementsByClassName("k-form-error");
        let parent
        if (errorElemnts[0] != undefined) {
             parent = errorElemnts[0].parentElement;
            let select = parent.getElementsByTagName("SELECT");
            let Input = parent.getElementsByTagName("INPUT");
            let TextArea = parent.getElementsByTagName("TEXTAREA");
            let elementsArray = [select, TextArea, Input];
            elementsArray.map((i)=>i.length>0?i[0].focus():null)
        } }
    public render = () => null;
}
 const ErrorFocus = connect<{}>(ErrorFocusInternal);
export default ErrorFocus