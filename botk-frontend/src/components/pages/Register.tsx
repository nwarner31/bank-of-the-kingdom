import {useSelector, useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import './Register.css';
import '../../Theming.css';
import { ChangeEvent, useState} from "react";
import HoverButton from "../controls/HoverButton";
import properties from '../../utility/data/application.json';
import {Actions} from "../../store/my-data-store";


function Register() {

    const initialUserState = {"first_name": "", "last_name": "", "address1": "",
        "address2": "", "city": "", "kingdom": "", "email": "", "username": "",
        "password": ""};
    const initialErrorState = {"first_name": false, "last_name": false, "address1": false,
        "address2": false, "city": false, "kingdom": false, "email": false, "username": false,
        "password": false, "password2": false};
    // @ts-ignore
    const theme = useSelector(state => state.theme);
    const [userInfo, setUserInfo] = useState(initialUserState);
    const [errorInfo, setErrorInfo] = useState(initialErrorState);
    const [password2, setPassword2] = useState("")

    const dispatch = useDispatch();
    const navigate = useNavigate();

    function updateUserInfo(fieldName: string, newValue: string) {
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
        fetch(properties.url+'/register').then(response => {
            //console.log(res);
            return response.json();
        }).then(data => {console.log(data)});
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
            console.log(body);
            fetch(properties.url+'/register', {method: 'POST',
                body: body,
                headers: {'Content-Type': 'application/json'}}).then(response => {
                console.log(response);
                return response.json()
            }).then(data => {
                if(data.customer) {
                    dispatch(({type: Actions.Login, payload: {customer: data.customer, token: data.token}}));

                    navigate("/dashboard");
                } else {
                    console.log("Error");
                }
            });
        }

    }

    return (
    <>

        <div className='register-page main-color-bg' >
            <div className='register-page-contents'>
            <h1>Register Page</h1>
            <div className='register-input-row'>
                <RegisterInput label='First Name' name='first_name' value={userInfo.first_name} hasError={errorInfo.first_name} isPassword={false} valueChange={updateUserInfo} clearError={clearError} />
                <RegisterInput label='Last Name' name='last_name' value={userInfo.last_name} hasError={errorInfo.last_name} isPassword={false} valueChange={updateUserInfo} clearError={clearError} />
            </div>
            <div className='register-input-row'>
                <RegisterInput label='Address 1' name='address1' value={userInfo.address1} hasError={errorInfo.address1} isPassword={false} valueChange={updateUserInfo} clearError={clearError} />
                <RegisterInput label='Address 2' name='address2' hasError={errorInfo.address2} value={userInfo.address2} isPassword={false} valueChange={updateUserInfo} clearError={clearError} />
            </div>

            <div className='register-input-row'>
                <RegisterInput label='City' name='city' value={userInfo.city} hasError={errorInfo.city} isPassword={false} valueChange={updateUserInfo} clearError={clearError} />
                <RegisterInput label='Kingdom' name='kingdom' value={userInfo.kingdom} hasError={errorInfo.kingdom} isPassword={false} valueChange={updateUserInfo} clearError={clearError} />
            </div>
                <div className='register-input-row'>
                    <RegisterInput label='Email' name='email' value={userInfo.email} hasError={errorInfo.email} isPassword={false} valueChange={updateUserInfo} clearError={clearError} />
                    <RegisterInput label='Username' name='username' value={userInfo.username} hasError={errorInfo.username} isPassword={false} valueChange={updateUserInfo} clearError={clearError} />
                </div>
                <div className='register-input-row'>
                    <RegisterInput label='Password' name='password' value={userInfo.password} isPassword={true} hasError={errorInfo.password} valueChange={updateUserInfo} clearError={clearError} />
                    <RegisterInput label='Reenter Password' name='password2' value={password2} isPassword={true} hasError={errorInfo.password2} valueChange={updateUserInfo} clearError={clearError} />
                </div>
                <div>
                    <HoverButton text='Cancel' baseClass='secondary-color-bg' hoverClass='secondary-color-text' className='register-button' clickAction={cancel} />
                    <HoverButton text='Register' baseClass='secondary-color-bg' hoverClass='secondary-color-text' className='register-button' clickAction={registerUser} />
                </div>
            </div>
        </div>
    </>
    );
}

interface riprops {
    label: string,
    name: string,
    value: string,
    isPassword: boolean,
    hasError: boolean,
    valueChange: (field: string, newValue: string) => void,
    clearError: (field: string) => void
}

function RegisterInput(props: riprops) {
    function valueChanged(event: ChangeEvent<HTMLInputElement>) {
        const newValue = event.target.value ?? '';
        props.valueChange(props.name, newValue);
    }

    function hasFocus() {
        props.clearError(props.name);
    }

    return  (
        <div className='register-input-column'>
            <div className='register-input-label'>
                <label>{props.label}{props.hasError && <span className='register-input-error'>Error</span>}:</label>
            </div>
            <div className='register-input-div'>
                <input type={props.isPassword ? 'password' : 'text'} name={props.name} className='register-input' onChange={valueChanged} value={props.value} onFocus={hasFocus} />
                <span className="register-input-error-icon">
                    {props.hasError && <img src={`./resources/images/x.png`} />}
                </span>
            </div>
        </div>
    );
}

export default Register;