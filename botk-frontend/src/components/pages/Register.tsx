import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import '../../common.css';
import '../../Theming.css';
import { ChangeEvent, useState} from "react";
import HoverButton from "../controls/HoverButton";
import TextInput from "../controls/TextInput";
import properties from '../../utility/data/application.json';
import {Actions} from "../../store/my-data-store";


function Register() {

    const initialUserState = {"first_name": "", "last_name": "", "address1": "",
        "address2": "", "city": "", "kingdom": "", "email": "", "username": "",
        "password": ""};
    const initialErrorState = {"first_name": false, "last_name": false, "address1": false,
        "address2": false, "city": false, "kingdom": false, "email": false, "username": false,
        "password": false, "password2": false};
    const [userInfo, setUserInfo] = useState(initialUserState);
    const [errorInfo, setErrorInfo] = useState(initialErrorState);
    const [password2, setPassword2] = useState("")

    const dispatch = useDispatch();
    const navigate = useNavigate();

    function updateUserInfo(event: ChangeEvent<HTMLInputElement>) {
        const fieldName = event.target.name;
        const newValue = event.target.value
        if (fieldName === "password2") {
            setPassword2(newValue)
        } else {
            setUserInfo((prevState => {
                return {...prevState, [fieldName]: newValue}
            }));
        }
        console.log(userInfo);
    }

    function validateField(fieldName: string, value: string): boolean {
        if (value.trim() === "") {
            return false;
        } else {
            if (fieldName === "email") {
                if (!value.includes("@") || !value.includes(".") || value.lastIndexOf(".") < value.indexOf("@")) {
                    return false;
                }
            } else if (fieldName === "password") {
                return value.length >= 6;
            }
        }

        return true;
    }

    function clearError(fieldName: string) {
        setErrorInfo((prevState => {
            return {...prevState, [fieldName]: false}
        }));
    }

    function cancel() {
        console.log('Cancel clicked');
    }

    function registerUser() {
        console.log('Register clicked');
        const body = JSON.stringify(userInfo);
        let isValid = true;
        for (const [key, value] of Object.entries(userInfo)) {
            if (key !== "address2") {
                if (!validateField(key, value)) {
                    //alert(`${key} is invalid`);
                    isValid = false;
                    setErrorInfo((prevState => {
                        return {...prevState, [key]: true}
                    }));
                }
            }
        }
        if (isValid) {
            fetch(properties.url+'/register', {method: 'POST',
                body: body,
                headers: {'Content-Type': 'application/json'}}).then(response => {
                console.log(response);
                return response.json();
            }).then(data => {
                if(data.customer) {
                    dispatch(({type: Actions.Login, payload: {customer: data.customer, accounts: [], loans: [], token: data.token}}));

                    navigate("/dashboard");
                } else {
                    console.log("Error");
                }
            });
        }

    }

    return (
    <>

        <div className='main-color-bg' >
            <div className='wide-page'>
            <h1 className="headline">Register Page</h1>
            <div className='float-container line-space'>
                <TextInput label="First Name" name="first_name" value={userInfo.first_name} hasError={errorInfo.first_name} type="text" onChange={updateUserInfo} clearError={clearError} className="main-column float-left" />
                <TextInput label="Last Name" name="last_name" value={userInfo.last_name} hasError={errorInfo.last_name} type="text" onChange={updateUserInfo} clearError={clearError} className="main-column float-left mobile-line" />
            </div>
            <div className='float-container line-space'>
                <TextInput label="Address 1" name="address1" value={userInfo.address1} hasError={errorInfo.address1} type="text" onChange={updateUserInfo} clearError={clearError} className="main-column float-left" />
                <TextInput label="Address 2" name="address2" value={userInfo.address2} type="text" onChange={updateUserInfo} className="main-column float-left mobile-line" />
            </div>

            <div className='float-container line-space'>
                <TextInput label="City" name="city" value={userInfo.city} hasError={errorInfo.city} type="text" onChange={updateUserInfo} clearError={clearError} className="main-column float-left" />
                <TextInput label="Kingdom" name="kingdom" value={userInfo.kingdom} hasError={errorInfo.kingdom} type="text" onChange={updateUserInfo} clearError={clearError} className="main-column float-left mobile-line" />
            </div>
                <div className='float-container line-space'>
                    <TextInput label="Email" name="email" value={userInfo.email} hasError={errorInfo.email} type="text" onChange={updateUserInfo} clearError={clearError} className="main-column float-left" />
                    <TextInput label="Username" name="username" value={userInfo.username} hasError={errorInfo.username} type="text" onChange={updateUserInfo} clearError={clearError} className="main-column float-left mobile-line" />
                </div>
                <div className='float-container line-space'>
                    <TextInput label="Password" name="password" value={userInfo.password} type="password" hasError={errorInfo.password} onChange={updateUserInfo} clearError={clearError} className="main-column float-left" />
                    <TextInput label="Reenter Password" name="password2" value={password2} type="password" hasError={errorInfo.password2} onChange={updateUserInfo} clearError={clearError} className="main-column float-left mobile-line" />
                </div>
                <div>
                    <HoverButton text='Cancel' baseClass='secondary-color-bg' hoverClass='secondary-color-text' className='smaller-button small-spacing' clickAction={cancel} />
                    <HoverButton text='Register' baseClass='secondary-color-bg' hoverClass='secondary-color-text' className='smaller-button small-spacing' clickAction={registerUser} />
                </div>
            </div>
        </div>
    </>
    );
}

export default Register;