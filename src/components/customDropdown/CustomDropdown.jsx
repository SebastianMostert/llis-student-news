import React from 'react';
import styles from './customDropdown.module.css';

const CustomDropdown = ({ options, value, onChange }) => {
    return (
        <div className={styles.dropdownContainer}>
            <select
                className={styles.dropdown}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {options.map((option, index) => (
                    <option key={index} value={option} >
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CustomDropdown;
