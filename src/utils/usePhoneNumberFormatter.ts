// src/utils/usePhoneNumberFormatter.ts
import { useState } from "react";
import { AsYouType } from "libphonenumber-js";

const usePhoneNumberFormatter = (
  initialValue: string,
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>
) => {
  const [phoneNumber, _setPhoneNumber] = useState(initialValue);

  const formatPhoneNumber = (value: string) => {
    const asYouType = new AsYouType("KZ");
    return asYouType.input(value);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setPhoneNumber(formattedPhoneNumber);
  };

  return { phoneNumber, handlePhoneNumberChange };
};

export default usePhoneNumberFormatter;
