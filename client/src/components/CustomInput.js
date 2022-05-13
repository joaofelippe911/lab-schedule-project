import React, { memo, useState } from "react";

import { mask as masker, unMask as unMasker } from "remask";

function CustomInput({
  name,
  onChange,
  mask,
  minLength,
  maxLength,
  label,
  required,
  readOnly,
  ...props
}) {
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    if (mask) {
      const value = unMasker(event.target.value);
      const newValue = masker(value, mask);

      onChange({
        ...event,
        target: {
          ...event.target,
          name,
          value: newValue,
        },
      });
    } else {
      const value = event.target.value;
      onChange({
        ...event,
        target: {
          ...event.target,
          name,
          value: value,
        },
      });
    }
  }

  function verifyErrors(event) {
    const value = event.target.value;

    if (required && value.length === 0) {
      return setErrors({ error: "Este campo é obrigatório!" });
    }

    if (
      (required && value.length < minLength) ||
      (!required && value.length > 0 && value.length < minLength)
    ) {
      return setErrors({ error: "Muito curto!" });
    }

    if (value.length > maxLength) {
      return setErrors({ error: "Muito longo!" });
    }

    setErrors({});
  }

  return (
    <div className="input-container">
      <label htmlFor={name}>
        {label}: {errors.error && <span>{errors.error}</span>}
      </label>
      <input
        {...props}
        onChange={handleChange}
        onBlur={verifyErrors}
        required={required}
        readOnly={readOnly}
        className={(errors.error && "wrong") || (readOnly && "read-only")}
      />
    </div>
  );
}

export default memo(CustomInput);
