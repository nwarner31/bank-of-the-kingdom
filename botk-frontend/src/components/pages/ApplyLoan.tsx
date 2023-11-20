import {useSelector, useDispatch} from "react-redux";
import {Navigate, useNavigate} from "react-router-dom";
import {ChangeEvent, useState} from "react";

import TextInput from "../controls/TextInput";
import HoverButton from "../controls/HoverButton";
import properties from '../../utility/data/application.json';
import {Actions, ReduxState} from "../../store/my-data-store";
import '../../common.css';
import '../../Theming.css';
import toast from "react-hot-toast";



function ApplyLoan() {
    const initialLoanInfo = {"loan_type": "", "loan_name": "", "loan_amount": "", "customer_income": "", "customer_credit_score": ""};
    const initialErrorState = {"loan_type": false, "loan_name": false, "loan_amount": false, "customer_income": false, "customer_credit_score": false};

    const [loanInfo, setLoanInfo] = useState(initialLoanInfo);
    const [errorInfo, setErrorInfo] = useState(initialErrorState);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const loggedIn = useSelector((state: ReduxState) => state.loggedIn);
    const token = useSelector((state: ReduxState) => state.token);
    if (!loggedIn) {
        return (<Navigate to='/' replace={true}/>);
    }




    function updateLoanInfo(event: (ChangeEvent<HTMLInputElement | HTMLSelectElement>) ){
        const fieldName = event.target.name;
        const newValue = event.target.value;
        setLoanInfo(prevState => {
            return {...prevState, [fieldName]: newValue}
        })
    }

    function clearError(fieldName: string) {
        setErrorInfo((prevState => {
            return {...prevState, [fieldName]: false}
        }));
    }

    function cancel() {
        navigate("/dashboard");
    }

    function validateField(fieldName: string, value: String): boolean {
        if (value.trim() === "") {
            return false;
        }

        return true;
    }

    function submitLoan() {
        console.log("submit");
        let isValid = true;
        for (const [key, value] of Object.entries(loanInfo)) {
            if (!validateField(key, value)) {
                //alert(`${key} is invalid`);
                isValid = false;
                setErrorInfo((prevState => {
                    return {...prevState, [key]: true}
                }));
            }
        }
        if (isValid) {
            if (Number(loanInfo.loan_amount) <= 0) {
                toast.error("The loan must be for more that zero", {className: "error-toast"});
                return;
            } else if (Number(loanInfo.customer_income) <= 0) {
                toast.error("Your income must be greater than zero");
            }
            const loan_amount = Number(loanInfo.loan_amount);
            const customer_income = Number(loanInfo.customer_income);
            const customer_credit_score = Number(loanInfo.customer_credit_score);
            const bodyRaw = {...loanInfo, loan_amount, customer_income, customer_credit_score};
            const body = JSON.stringify({...bodyRaw});
            console.log(body);
            fetch(properties.url + "/loan", {method: "POST", body,
                headers: {"Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`}}).then(response => {
                        return response.json();
            }).then(data => {
                if (data.id) {
                    dispatch({type: Actions.AddLoan, payload: {loan: data}});
                    toast("You have successfully applied for a loan");
                    navigate("/dashboard");
                } else {
                    toast.error("There was a server error", {className: "error-toast"})
                }
            });
        }
    }


    return (
        <div className='main-color-bg'>
            <div className="wide-page">
            <h1 className="headline">Apply for a loan</h1>
            <div>
                    <div className="float-container line-space" >
                        <div className="main-column float-left ">
                            <div className="text-left"><label>Loan Type:</label>{errorInfo.loan_type && <span className="float-right bold-text">Error:</span>}</div>
                            <div>
                                <select value={loanInfo.loan_type} onChange={updateLoanInfo} onFocus={() => clearError("loan_type")} className="full-width">
                                    <option value="">Select a loan type</option>
                                    <option value="auto">Auto</option>
                                    <option value="home">Home</option>
                                    <option value="personal">Personal</option>
                                </select>
                            </div>
                        </div>

                        <TextInput label="Loan Name:" name="loan_name" value={loanInfo.loan_name} type="text" hasError={errorInfo.loan_name} onChange={updateLoanInfo} clearError={clearError} className="main-column float-left mobile-line" />
                    </div>
                    <div className="float-container line-space" >
                        <TextInput label="Loan Amount:" name="loan_amount" value={loanInfo.loan_amount} type="text" hasError={errorInfo.loan_amount} onChange={updateLoanInfo} clearError={clearError} className="main-column float-left" />
                    </div>
                    <div className="float-container line-space">
                        <TextInput label="Annual Income:" name="customer_income" value={loanInfo.customer_income} type="text" hasError={errorInfo.customer_income} onChange={updateLoanInfo} clearError={clearError} className="main-column float-left" />
                        <TextInput label="Credit Score:" name="customer_credit_score" value={loanInfo.customer_credit_score} type="text" hasError={errorInfo.customer_credit_score} onChange={updateLoanInfo} clearError={clearError} className="main-column float-left mobile-line" />
                    </div>
                    <div>
                        <HoverButton text="Cancel" baseClass='secondary-color-bg' hoverClass='secondary-color-text' clickAction={cancel} className="smaller-button small-spacing" />
                        <HoverButton text="Apply" baseClass='secondary-color-bg' hoverClass='secondary-color-text' clickAction={submitLoan} className="smaller-button small-spacing" />
                    </div>
            </div>
            </div>
        </div>
    );
}

export default ApplyLoan;