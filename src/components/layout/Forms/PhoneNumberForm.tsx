// src/components/Forms/PhoneNumberForm.tsx
import React from "react";
import "./PhoneNumberForm.scss";
import usePhoneNumberFormatter from "../../../utils/usePhoneNumberFormatter";

interface PhoneNumberFormProps {
  phoneNumber: string;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
}

const PhoneNumberForm: React.FC<PhoneNumberFormProps> = ({ phoneNumber, setPhoneNumber, onSubmit }) => {
  const { handlePhoneNumberChange } = usePhoneNumberFormatter(phoneNumber, setPhoneNumber);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="phone-number-form">
      <h2>Добро Пожаловать!</h2>
      <label htmlFor="phone-number">Введите Ваш номер телефона</label>
      <input
        id="phone-number"
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        placeholder="Номер телефона"
        required
      />
      <button type="submit">Получить код</button>
    </form>
  );
};

export default PhoneNumberForm;
