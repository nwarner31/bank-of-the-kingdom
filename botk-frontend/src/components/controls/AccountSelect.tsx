import {Account} from "../../models";
import {ChangeEvent} from "react";

interface asprops {
    label: string,
    accounts: Account[],
    name?: string,
    value: number,
    updateValue: ((ewValue: number, name?: string) => void) | ((newValue: number) => void)
}

function AccountSelect(props: asprops) {
    const accounts = props.accounts;
    function setValue(e: ChangeEvent<HTMLSelectElement>) {
        const newValue = Number(e.target.value)
        props.updateValue(newValue, props.name);

    }
    return (
        <div>
            <div>
                {props.label}:
            </div>
            <div>
                <select value={props.value} onChange={setValue}>
                    <option value={-1} >Select an account</option>
                        {accounts.map((account: Account) => <option key={account.id} value={account.id}>{account.id}: {account.account_name} - {account.account_type} (Balance: {account.balance})</option>
                    )}
                </select>
            </div>
        </div>
    );
}

export default AccountSelect;