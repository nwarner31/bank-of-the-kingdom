import HoverButton from "../controls/HoverButton";
import TextInput from "../controls/TextInput";
import {ChangeEvent, useState} from "react";
import toast from 'react-hot-toast';
import '../../Theming.css';
import '../../common.css';
import properties from "../../utility/data/application.json";
import {useDispatch} from "react-redux";
import {Actions} from "../../store/my-data-store";
import {useNavigate} from "react-router-dom";


function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

   function updateUsername(event: ChangeEvent<HTMLInputElement>) {
        setUsername(event.target.value);
    }

    function updatePassword(event: ChangeEvent<HTMLInputElement>) {
       setPassword(event.target.value);
    }

    function cancel() {
        navigate("/");
    }

    function loginUser() {
        console.log(username + " " + password);
        if (username.trim() === "" || password.trim() === "") {
            toast.error("Please enter a username and a password", {className: 'error-toast'});
        } else {
            const body = JSON.stringify({"username": username, "password": password});
            fetch(properties.url+'/login', {method: 'POST',
                body: body,
                headers: {'Content-Type': 'application/json'}}).then(response => {
                console.log(response.status);
                return response.json()
            }).then(data => {

                if(data.customer) {
                    const customer = data.customer;
                    const accounts = customer.accounts;
                    const loans = customer.loans;
                    delete customer.accounts;
                    delete customer.loans
                    console.log(data.customer);
                    dispatch(({type: Actions.Login, payload: {customer: data.customer, accounts, loans, token: data.token}}));

                    navigate("/dashboard");
                } else {
                    toast.error("Incorrect user information", {className: "error-toast"});
                }
            }).catch(error => {
                toast.error("Server error", {className: "error-toast"});
            });
        }
    }

    return (
        <div className='main-color-bg '>
            <div className="narrow-page">
            <h1 className="headline">Login Page</h1>
            <div>
                <TextInput label="Username" value={username} type="text" onChange={updateUsername} className="line-space" />
                <TextInput label="Password" value={password} type="password" onChange={updatePassword} className="line-space" />
            </div>
            <div>
                <HoverButton text='Cancel' baseClass='secondary-color-bg' hoverClass='secondary-color-text' className='smaller-button small-spacing' clickAction={cancel} />
                <HoverButton text='Login' baseClass='secondary-color-bg' hoverClass='secondary-color-text' className='smaller-button small-spacing' clickAction={loginUser} />
            </div>
        </div>
        </div>
    );
}


export default Login;