import {Navigate} from "react-router-dom";
import {useSelector} from "react-redux";
import HoverButton from "../controls/HoverButton";

import '../../Theming.css';
import './CreateAccount.css';
import {SetStateAction, useState} from "react";
import properties from '../../utility/data/application.json';


function CreateAccount() {

    const [accountType, setAccountType] = useState('checking');
    const [accountName, setAccountName] = useState('');


    // @ts-ignore
    const loggedIn = useSelector(state => state.loggedIn);
    // @ts-ignore
    const token = useSelector(state => state.token);

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
                'Authorization': `Bearer ${token}`}}).then(data => {
                    console.log(data);
            });
        }
    }

    return (
        <div className='main-color-bg'>
            <div>
                <h2>Create Account</h2>
                <div className='ca-input-section'>
                    <div>Account Type:</div>
                    <div>
                        <select placeholder='Select an account type' value={accountType} onChange={updateAccountType}>
                            <option value='checking'>Checking</option>
                            <option value='savings'>Savings</option>
                        </select>
                    </div>
                </div>
                <div className='ca-input-section'>
                    <div>
                        Account Name:
                    </div>
                    <div>
                        <input type='text' name='account-name' value={accountName} onChange={updateAccountName} />
                    </div>
                </div>
                <div className='ca-button-group'>
                    <HoverButton text='Cancel' baseClass='secondary-color-bg' hoverClass='secondary-color-text' className='create-account-buttons cab-left' />
                    <HoverButton text='Create' baseClass='secondary-color-bg' hoverClass='secondary-color-text' className='create-account-buttons' clickAction={createAccount} />
                </div>
            </div>
        </div>
    );
}

export default CreateAccount;