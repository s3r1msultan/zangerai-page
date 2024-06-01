import React, { useCallback, useEffect, useRef, useState } from "react";
import "./LoginPage.scss";
import PhoneNumberForm from "../../layout/Forms/PhoneNumberForm";
import OTPForm from "../../layout/Forms/OTPForm";
import Modal from "../../layout/Modal/Modal";
import { useNavigate } from "react-router-dom";
import { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";
import { auth } from "../../../configs/firebase-config";
import { sendOTP, verifyOTP, checkUserExists, setIsSentOTP } from "../../../app/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";

declare global {
  interface Window {
    _recaptchaVerifier?: RecaptchaVerifier;
    _confirmationResult?: ConfirmationResult;
    _captchaWidgetId?: number;
    grecaptcha?: {
      reset: (widgetId: number) => any;
    };
  }
}

const LoginPage: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState<"resend" | "change">("resend");
  const captchaContainerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isSentOTP, verificationId } = useAppSelector((state) => state.auth);

  const handlePhoneNumberSubmit = async () => {
    try {
      dispatch(sendOTP({ phone: phoneNumber }));
    } catch (error) {
      console.error("Error during phone number submission:", error);
    }
  };

  const handleOtpSubmit = async (otp: string) => {
    try {
      if (verificationId) {
        await dispatch(verifyOTP({ verificationId, code: otp }));
        if (checkUserExists(phoneNumber)) {
          navigate("/chat");
        } else {
          navigate("/register");
        }
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
    }
  };

  const handleResendOtp = () => {
    setModalAction("resend");
    setIsModalVisible(true);
  };

  const handleChangeNumber = () => {
    setModalAction("change");
    setIsModalVisible(true);
  };

  const handleModalConfirm = async () => {
    if (modalAction === "resend") {
      await handlePhoneNumberSubmit();
    } else if (modalAction === "change") {
      setPhoneNumber("");
      dispatch(setIsSentOTP(false));
    }
    setIsModalVisible(false);
  };

  const registerContainerRef = useCallback((node: HTMLDivElement) => {
    if (node) {
      captchaContainerRef.current = node;
      node.id = "recaptcha-container-wrap";
      node.innerHTML = `<div id="recaptcha-container"></div>`;
    }
  }, []);

  useEffect(() => {
    if (!window._recaptchaVerifier) {
      window._recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: (response: any) => {
          window._captchaWidgetId = response;
        },
        "expired-callback": () => {
          window._recaptchaVerifier?.clear();
          window._recaptchaVerifier = undefined;
        },
      });
    }

    return () => {
      if (window._recaptchaVerifier) {
        window._recaptchaVerifier.clear();
        window._recaptchaVerifier = undefined;
        // window.grecaptcha?.reset(window._captchaWidgetId || 0);
        // setPhoneNumber("");
        dispatch(setIsSentOTP(false));
      }
    };
  }, []);

  return (
    <div className="login-page">
      <div className="container">
        {!isSentOTP ? (
          <PhoneNumberForm
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            onSubmit={handlePhoneNumberSubmit}
          />
        ) : (
          <OTPForm
            onChangeNumber={handleChangeNumber}
            phoneNumber={phoneNumber}
            onResend={handleResendOtp}
            onSubmit={handleOtpSubmit}
          />
        )}
      </div>

      <Modal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={handleModalConfirm}
        title={modalAction === "resend" ? "Подтверждение" : "Изменить номер телефона"}
        message={
          modalAction === "resend"
            ? "Вы уверены, что хотите отправить код снова?"
            : "Вы уверены, что хотите изменить номер телефона?"
        }
      />
      <div ref={registerContainerRef} />
    </div>
  );
};

export default LoginPage;
