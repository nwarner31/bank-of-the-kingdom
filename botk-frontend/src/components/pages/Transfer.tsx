import {useDispatch, useSelector} from "react-redux";
import {Navigate, useNavigate} from "react-router-dom";
import {SetStateAction, useEffect, useRef, useState} from "react";

import properties from '../../utility/data/application.json';
import '../../Theming.css';
import './Transfer.css';
import {Actions} from '../../store/my-data-store';
import HoverButton from "../controls/HoverButton";

function Transfer() {
    // @ts-ignore
    const loggedIn = useSelector(state => state.loggedIn);
    // @ts-ignore
    const token = useSelector(state => state.token);
    // @ts-ignore
    const acc = useSelector(state => state.accounts);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    //const [accounts, setAccounts] = useState([]);
    const [toActive, setToActive] = useState(false);
    const [fromAccount, setFromAccount] = useState(-1);
    const [toAccount, setToAccount] = useState(-1);
    const [toAccounts, setToAccounts] = useState([]);
    const [amount, setAmount] = useState('');

    function updateFrom(event: { target: { value: SetStateAction<string>; }; }) {
        const from = Number(event.target.value);
        setFromAccount(from);
        if (from === -1) {
            setToActive(false);
            setToAccount(-1);
        } else {
            setToActive(true);
            setToAccounts(acc.filter((account: { id: number; }) => account.id !== from));
            console.log(toAccounts);
        }
    }

    function updateTo(event: { target: { value: SetStateAction<string>; }; }) {
        setToAccount(Number(event.target.value));
    }

    function updateAmount(event: { target: { value: any; }; }) {

        setAmount(event.target.value);
    }

    const dataFetch = useRef(false);
    useEffect(() => {
        // to prevent a second fetch request
        if (dataFetch.current)
            return;
        dataFetch.current = true;

    //     fetch(properties.url + '/account', {headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${token}`
    //         }}).then(response => {return response.json();}).then(data => {
    //        console.log(data);
    //        //setAccounts(data);
    //     });
     }, []);

    if (!loggedIn) {
        return (<Navigate to='/' replace={true} />);
    }

    let mainBody = (
        <div>
            You need to have 2 or more accounts to transfer between.
        </div>
    );

    if (acc.length > 1) {
        mainBody = (
            <div>
                <div>
                    <div>
                        <div>
                            Transfer from:
                        </div>
                        <div>
                            <select value={fromAccount} onChange={updateFrom}>
                                <option value={-1} >Select an account</option>
                                {acc.map((account: any) => <AccountOption account={account} />)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <div>
                            Transfer to:
                        </div>
                        <div>
                            <select disabled={!toActive} value={toAccount} onChange={updateTo}>
                                <option value={-1} >Select an account</option>
                                {toAccounts.map((account: any) => <AccountOption account={account} />)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <div>
                            Amount:
                        </div>
                        <div>
                            <input type='number' value={amount} onChange={updateAmount} onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                }
                            }}/>
                        </div>
                    </div>
                </div>
                <div className='transfer-button-container'>
                    <HoverButton text='Cancel' baseClass='secondary-color-bg' hoverClass='secondary-color-text' className='transfer-buttons tb-first' clickAction={cancel} />
                    <HoverButton text='Transfer' baseClass='secondary-color-bg' hoverClass='secondary-color-text' className='transfer-buttons' clickAction={submitTransfer} />
                </div>
            </div>
        );
    }

    function cancel() {
        navigate("/dashboard");
    }

    function submitTransfer() {
        const fromIndex = acc.findIndex((a: { id: number; }) => a.id === fromAccount);
        const from = {...acc[fromIndex]};
        const toIndex = acc.findIndex((a: { id: number; }) => a.id === toAccount)
        const to = {...acc[toIndex]};
        console.log(from);
        console.log(to);
        // ToDo finish with toasts
        if (from === undefined || to === undefined) {

        } else if (amount === "" || Number(amount) <= 0) {

        } else if (Number(amount) > from.balance) {

        } else {
            const body = JSON.stringify({from_id: fromAccount, to_id: toAccount, amount: Number(amount)});
            console.log(body);
            fetch(properties.url + "/transfer", {method: "POST", body,
                headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}}).then(response => {
                    return response.json();
            }).then(data => {
                console.log(data);
                if (data.status_code === 200) {
                    from.balance -= Number(amount);
                    to.balance += Number(amount);
                    console.log(acc);
                    dispatch({type: Actions.UpdateAccounts, payload: {accounts: [to, from]}});
                    navigate("/dashboard");
                    // ToDo finish with toast
                }
            });
        }
    }

    return (
        <div className='main-color-bg'>
            <div className='transfer-page'>
                Transfer Page
                {mainBody}
            </div>

        </div>
    );
}

interface aoprops {
    account: {
        id: number,
        account_type: string,
        account_name: string,
        balance: number
    }
}

function AccountOption(props: aoprops) {
    return (
        <option value={props.account.id}>{props.account.id}: {props.account.account_name} - {props.account.account_type} (Balance: {props.account.balance})</option>
    );
}

export default Transfer;