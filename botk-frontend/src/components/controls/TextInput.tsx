import {InputHTMLAttributes, FC} from "react";

import styles from './TextInput.module.css';
import xIcon from '../../resources/x.png';

interface inputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string,
    hasError?: boolean,
    clearError?: (field: string) => void,
    //className?: string,
}

const TextInput: FC<inputProps> = ({label, className, hasError, clearError, ...rest})=> {

    function hasFocus() {
        if (clearError && rest.name) {
            clearError(rest.name);
        }
    }

    return  (
        <div className={className ?? ''}>
            <div className={styles.inputLabel}>
                <label>{label}{hasError && <span className={styles.inputError} >Error:</span>}</label>
            </div>
            <div className={styles.inputDiv} >
                <input className={styles.input} onFocus={hasFocus} {...rest} />
                <span className={styles.inputErrorIcon} >
                    {hasError && <img src={xIcon} alt="Error marker" />}
                </span>
            </div>
        </div>
    );
}

export default TextInput;