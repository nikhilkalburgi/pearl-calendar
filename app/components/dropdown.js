import React from 'react';
import styles from "@/app/page.module.css";

export default function RoundedDropdown(props) {
  const options = props.options;

  const handleSelectChange = (event) => {
    props.setRepeatType(event.target.value);
  };

  return (
    <div className={styles.dropdownContainer}>
      <select
        value={props.repeatType}
        onChange={handleSelectChange}
        className={styles.dropdown}
      >
        <option value="" >Select repeat type</option>
        {options.map((option, index) => (
          <option className={styles.option} key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
