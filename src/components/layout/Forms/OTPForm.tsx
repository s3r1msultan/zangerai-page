// src/components/Forms/OTPForm.tsx
import React, { useState, useEffect, useRef } from "react";
import "./OTPForm.scss";

interface OTPFormProps {
  phoneNumber: string;
  onResend: () => void;
  onSubmit: (otp: string) => void;
  onChangeNumber: () => void;
}

const OTPForm: React.FC<OTPFormProps> = ({ phoneNumber, onResend, onSubmit, onChangeNumber }) => {
  const [otpCode, setOtpCode] = useState("");
  const [timer, setTimer] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setResendEnabled(true);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer]);

  useEffect(() => {
    setTimer(60);
    setResendEnabled(false);
  }, [phoneNumber]);

  const handleResend = (e: React.MouseEvent) => {
    e.preventDefault();
    onResend();
    setResendEnabled(false);
    setTimer(60);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(otpCode);
  };

  return (
    <form onSubmit={handleSubmit} className="otp-form">
      <p>
        Мы отправили код на{" "}
        <span className="phone-number" onClick={onChangeNumber}>
          {phoneNumber}
        </span>
        , <br /> введите его.
      </p>
      <input
        id="otp-code"
        type="text"
        value={otpCode}
        onChange={(e) => setOtpCode(e.target.value)}
        placeholder="Код"
        required
      />
      <button type="submit">Подтвердить код</button>
      <p>
        {resendEnabled ? (
          <a href="#" onClick={handleResend}>
            Отправить снова
          </a>
        ) : (
          <>Отправить снова через {timer} секунд</>
        )}
      </p>
    </form>
  );
};

export default OTPForm;
