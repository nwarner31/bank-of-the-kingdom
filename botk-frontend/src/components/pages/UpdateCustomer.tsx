import {Navigate, useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {ChangeEvent, useState} from "react";

import TextInput from "../controls/TextInput";
import HoverButton from "../controls/HoverButton";

import {ReduxState, Actions} from "../../store/my-data-store";
import '../../common.css';
import '../../Theming.css';
import properties from '../../utility/data/application.json';
import {Customer} from "../../models";

function UpdateCustomer() {
    const initialErrorState = {
        first_name: false,
        last_name: false,
        address1: false,
        city: false,
        kingdom: false,
        email: false};

    const customerInitialData = useSelector((state: ReduxState) => state.customer) ?? {
        address1: "",
        address2: "",
        city: "",
        email: "",
        first_name: "",
        id: 0,
        kingdom: "",
        last_name: "",
        username: ""
    };
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = useSelector((state: ReduxState) => state.token);
    const [customer, setCustomerInfo] = useState(customerInitialData);
    const [inputError, setInputError] = useState(initialErrorState);

    const loggedIn = useSelector((state: ReduxState) => state.loggedIn);
    if (!loggedIn) {
        return (<Navigate to='/' replace={true}/>);
    }
    function validateInputs(): boolean {
        let isValid = true;
        for (const field of Object.keys(inputError)) {
            const customerKey = field as keyof typeof customer;
            const value = String(customer[customerKey]);
            if (value.trim() === "") {
                setInputError(prevState => {
                    return {...prevState, [field]: true}
                });
                isValid = false;
            }
        }
        return isValid;
    }

    function clearError(fieldName: string) {
        setInputError(prevState => {
            return {...prevState, [fieldName]: false}
        });
    }


    function updateCustomerInfo(e: ChangeEvent<HTMLInputElement>) {
        const fieldName = e.target.name;
        const newValue = e.target.value;
        setCustomerInfo((prevState: Customer) => {
            return {...prevState, [fieldName]: newValue}});
    }

    function submitUpdate() {
        const customerInfo = {...customer};
        console.log(customerInfo);
        if (validateInputs()) {
            const customerId = customerInfo.id;
            delete customerInfo.id;
            const body = JSON.stringify(customerInfo);
            console.log(body);
            fetch(properties.url + `/customer/${customerId}`, {method: "PUT", body,
                headers: {"Content-Type": "application/json",
                "Authorization": `Bearer ${token}`}}).then(response => {
                    return response.json();
            }).then(data => {
                if(data.id) {
                    console.log(data);
                    dispatch({type: Actions.UpdateUser, payload: data});
                    navigate("/dashboard");
                }
            });
        }
    }

    return (
      <div className="main-color-bg">
          <div className="wide-page">
              <h1>Update Customer Info Page</h1>
                  <div className="float-container line-space">
                      <TextInput label="First Name" name="first_name" value={customer.first_name} onChange={updateCustomerInfo} className="main-column float-left" hasError={inputError.first_name} clearError={clearError} />
                      <TextInput label="Last Name" name="last_name" value={customer.last_name} onChange={updateCustomerInfo} className="main-column float-left mobile-line" hasError={inputError.last_name} clearError={clearError} />
                  </div>
                  <div className="float-container line-space">
                      <TextInput label="Address 1" name="address1" value={customer.address1} onChange={updateCustomerInfo} className="main-column float-left" hasError={inputError.address1} clearError={clearError} />
                      <TextInput label="Address 2" name="address2" value={customer.address2} onChange={updateCustomerInfo} className="main-column float-left mobile-line" />
                  </div>
                  <div className="float-container line-space">
                      <TextInput label="City" name="city" value={customer.city} onChange={updateCustomerInfo} className="main-column float-left" hasError={inputError.city} clearError={clearError} />
                      <TextInput label="Kingdom" name="kingdom" value={customer.kingdom} onChange={updateCustomerInfo} className="main-column float-left mobile-line" hasError={inputError.kingdom} clearError={clearError} />
                  </div>
                  <div className="float-container line-space">
                      <TextInput label="Email" name="email" value={customer.email} onChange={updateCustomerInfo} className="main-column float-left" hasError={inputError.email} clearError={clearError} />
                  </div>
              <HoverButton text="Cancel" baseClass="secondary-color-bg" hoverClass="secondary-color-text" clickAction={() => navigate("/dashboard")} className="smaller-button small-spacing" />
              <HoverButton text="Update Info" baseClass="secondary-color-bg" hoverClass="secondary-color-text" clickAction={submitUpdate} className="smaller-button small-spacing" />
          </div>
      </div>
    );
}

export default UpdateCustomer;