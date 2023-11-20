import {useDispatch, useSelector} from "react-redux";
import {Navigate, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";

import properties from '../../utility/data/application.json';
import '../../Theming.css';
import '../../common.css';
import {Actions, ReduxState} from '../../store/my-data-store';
import {Account} from "../../models";
import HoverButton from "../controls/HoverButton";
import AccountSelect from "../controls/AccountSelect";
import TextInput from "../controls/TextInput";
import toast from "react-hot-toast";

function Transfer() {

    const loggedIn = useSelector((state: ReduxState) => state.loggedIn);
    const token = useSelector((state: ReduxState) => state.token);
    const acc = useSelector((state: ReduxState) => state.accounts);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [toActive, setToActive] = useState(false);
    const [fromAccount, setFromAccount] = useState(-1);
    const [toAccount, setToAccount] = useState(-1);
    const [toAccounts, setToAccounts] = useState<Account[]>([]);
    const [amount, setAmount] = useState('');

    function updateFrom(from: number) {
        setFromAccount(from);
        if (from === -1) {
            setToActive(false);
            setToAccount(-1);
        } else {
            setToActive(true);
            setToAccounts(acc.filter((account: Account) => account.id !== from));
            console.log(toAccounts);
        }
    }

    function updateTo(to: number) {
        setToAccount(to);
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
                    <AccountSelect label="Transfer from" accounts={acc} value={fromAccount} updateValue={updateFrom} className="text-left line-space" />
                    <AccountSelect label="Transfer to" accounts={toAccounts} value={toAccount} updateValue={updateTo} disabled={!toActive} className="text-left line-space" />
                    <TextInput label="Amount" value={amount} onChange={updateAmount} type="number" className="line-space" />
                </div>
                <div className='line-space'>
                    <HoverButton text='Cancel' baseClass='secondary-color-bg' hoverClass='secondary-color-text' className='medium-button small-spacing' clickAction={cancel} />
                    <HoverButton text='Transfer' baseClass='secondary-color-bg' hoverClass='secondary-color-text' className='medium-button small-spacing' clickAction={submitTransfer} />
                </div>
            </div>
        );
    }

    function cancel() {
        navigate("/dashboard");
    }

    function submitTransfer() {
        if (fromAccount === -1 || toAccount === -1) {

            return;
        } else if (amount === "" || Number(amount) <= 0) {

            return;
        }
        const fromIndex = acc.findIndex((a: Account) => a.id === fromAccount);
        const from = {...acc[fromIndex]};
        const toIndex = acc.findIndex((a: Account) => a.id === toAccount)
        const to = {...acc[toIndex]};
        console.log(from);
        console.log(to);
        // ToDo finish with toasts
        if (Number(amount) > from.balance) {

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
                    toast("Transfer complete");
                    navigate("/dashboard");
                } else {
                    toast.error("There was a server error", {className: "error-toast"});
                }
            });
        }
    }

    return (
        <div className='main-color-bg'>
            <div className='narrow-page'>
                <h1 className="headline">Transfer Page</h1>
                {mainBody}
            </div>

        </div>
    );
}

export default Transfer;