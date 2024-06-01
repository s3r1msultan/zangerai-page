import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./../../../app/hooks";
import "./RegisterPage.scss";
import RegisterForm from "../../layout/Forms/RegisterForm";
import { createUser } from "../../../app/auth/authSlice";

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleRegister = async (firstName: string, lastName: string) => {
    try {
      await dispatch(createUser({ firstName, lastName }));
      navigate("/chat");
    } catch (error) {
      console.error("Error during registration:", error);
      navigate("/login");
    }
  };

  return (
    <div className="register-page">
      <RegisterForm onSubmit={handleRegister} />
    </div>
  );
};

export default RegisterPage;
