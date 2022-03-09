import React from "react";
// import InputMask from "react-input-mask";

import { mask as masker, unMask as unMasker } from "remask";

export function MaskedInput({ name, onChange, mask, ...props }) {


    function handleChange(event) {
        const originalValue = unMasker(event.target.value);
        const maskedValue=  masker(originalValue, mask);

        onChange({
             ...event,
             target: {
                 ...event.target,
                 name,
                 value: maskedValue
             }
            
        })
    }

  return (
      <input {...props} onChange={handleChange} />
  );
}
