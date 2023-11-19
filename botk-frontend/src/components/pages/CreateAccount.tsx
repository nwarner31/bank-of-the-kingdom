import {Navigate, useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {SetStateAction, useState} from "react";

import '../../Theming.css';
import '../../common.css';
import {Actions} from '../../store/my-data-store';
import properties from '../../utility/data/application.json';
import HoverButton from "../controls/HoverButton";
import TextInput from "../controls/TextInput";

function CreateAccount() {

    const [accountType, setAccountType] = useState('checking');
    const [accountName, setAccountName] = useState('');


    // @ts-ignore
    const loggedIn = useSelector(state => state.loggedIn);
    // @ts-ignore
    const token = useSelector(state => state.token);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    if (!loggedIn) {
        return (<Navigate to='/' replace={true}/>);
    }

    function updateAccountType(event: { target: { value: SetStateAction<string>; }; }) {
        setAccountType(event.target.value);
    }

    function updateAccountName(event: { target: { value: SetStateAction<string>; }; }) {
        setAccountName(event.target.value);
    }

    function createAccount() {
        console.log(accountType);
        console.log(accountName);

        // Validate Account Name
        if (accountName.trim() === "") {
            //return false;
        } else {
            const body = JSON.stringify({account_type: accountType, account_name: accountName});

            fetch(properties.url + '/account', {method: 'POST',
                body: body, headers: {'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`}}).then(response => {
                    return response.json();
            }).then(data => {
                console.log(data);
                dispatch({type: Actions.AddAccount, payload: {account: data}});
                navigate('/dashboard');
            });
        }
    }

    return (
        <div className='main-color-bg'>
            <div className="narrow-page">
                <h1 className="headline">Create Account</h1>
                <div className='line-space left-text'>
                    <div>Account Type:</div>
                    <div>
                        <select placeholder='Select an account type' value={accountType} onChange={updateAccountType} className="full-width">
                            <option value='checking'>Checking</option>
                            <option value='savings'>Savings</option>
                        </select>
                    </div>
                </div>
                <TextInput label="Account Name" value={accountName} onChange={updateAccountName} className="line-space" />
                <div className='small-vertical-spacing'>
                    <HoverButton text='Cancel' baseClass='secondary-color-bg' hoverClass='secondary-color-text' className='smaller-button small-spacing' />
                    <HoverButton text='Create' baseClass='secondary-color-bg' hoverClass='secondary-color-text' className='smaller-button small-spacing' clickAction={createAccount} />
                </div>
            </div>
        </div>
    );
}

export default CreateAccount;