import HoverButton from "../controls/HoverButton";
import {ChangeEvent, useState} from "react";
import '../../Theming.css';
import './Login.css';
import properties from "../../utility/data/application.json";
import {useDispatch} from "react-redux";
import {Actions} from "../../store/my-data-store";
import {useNavigate} from "react-router-dom";


function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

   function updateUsername(username: string) {
        setUsername(username);
    }

    function updatePassword(password: string) {
       setPassword(password)
    }

    function cancel() {

    }

    function loginUser() {
        console.log(username + " " + password);
        if (username.trim() === "" || password.trim() === "") {

        } else {
            const body = JSON.stringify({"username": username, "password": password});
            fetch(properties.url+'/login', {method: 'POST',
                body: body,
                headers: {'Content-Type': 'application/json'}}).then(response => {
                console.log(response.status);
                return response.json()
            }).then(data => {
                console.log(data);
                console.log("Then");
                //alert(data.code);

                if(data.customer) {
                    dispatch(({type: Actions.Login, payload: {customer: data.customer, token: data.token}}));

                    navigate("/dashboard");
                } else {
                    console.log("Error");
                }
            }).catch(error => {
                console.log(error);
            });
        }
    }

    return (
        <div className='main-color-bg login-page'>
            <h1>Login Page</h1>
            <div className='register-input-row'>
                <LoginInput label='Username' name='username' value={username} isPassword={false} valueChange={updateUsername} />
                <LoginInput label='Password' name='password' value={password} isPassword={true} valueChange={updatePassword} />
            </div>
            <div>
                <HoverButton text='Cancel' baseClass='secondary-color-bg' hoverClass='secondary-color-text' className='register-button' clickAction={cancel} />
                <HoverButton text='Login' baseClass='secondary-color-bg' hoverClass='secondary-color-text' className='register-button' clickAction={loginUser} />
            </div>
        </div>
    );
}

interface liprops {
    label: string,
    name: string,
    value: string,
    isPassword: boolean,
    valueChange: (newValue: string) => void
}

function LoginInput(props: liprops) {
    function valueChanged(event: ChangeEvent<HTMLInputElement>) {
        const newValue = event.target.value ?? '';
        props.valueChange(newValue);
    }

    return (
        <div className='register-input-column'>
            <div className='register-input-label'>
                <label>{props.label}:</label>
            </div>
            <div className='register-input-div'>
                <input type={props.isPassword ? 'password' : 'text'} name={props.name} className='register-input' onChange={valueChanged} value={props.value} />
            </div>
        </div>
    );
}

export default Login;