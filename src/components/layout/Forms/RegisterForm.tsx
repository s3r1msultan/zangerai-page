import { useState } from "react";
import "./RegisterForm.scss";

interface RegisterFormProps {
  onSubmit: (firstName: string, lastName: string) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const handleFirstName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value);
  };
  const handLastName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
  };

  return (
    <form onSubmit={(e) => onSubmit(firstName, lastName)} className="register-form">
      <h2>Регистрация</h2>
      <input type="text" value={firstName} onChange={handleFirstName} placeholder="Имя" required />
      <input type="text" value={lastName} onChange={handLastName} placeholder="Фамилия" required />
      <button type="submit">Получить код</button>
    </form>
  );
};

export default RegisterForm;
