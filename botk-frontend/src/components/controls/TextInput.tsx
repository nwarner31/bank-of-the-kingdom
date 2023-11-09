import {ChangeEvent} from "react";

import styles from './TextInput.module.css';

interface inputProps {
    label: string,
    name: string,
    value: string,
    isPassword: boolean,
    hasError: boolean,
    valueChange: (field: string, newValue: string) => void,
    clearError: (field: string) => void,
    className?: string | null,
}

function TextInput(props: inputProps) {
    function valueChanged(event: ChangeEvent<HTMLInputElement>) {
        const newValue = event.target.value ?? '';
        props.valueChange(props.name, newValue);
    }

    function hasFocus() {
        props.clearError(props.name);
    }

    return  (
        <div className={props.className ?? ''}>
            <div className={styles.inputLabel}>
                <label>{props.label}{props.hasError && <span className={styles.inputError} >Error:</span>}</label>
            </div>
            <div className={styles.inputDiv} >
                <input type={props.isPassword ? 'password' : 'text'} name={props.name} className={styles.input} onChange={valueChanged} value={props.value} onFocus={hasFocus} />
                <span className={styles.inputErrorIcon} >
                    {props.hasError && <img src={`./resources/images/x.png`} />}
                </span>
            </div>
        </div>
    );
}

export default TextInput;