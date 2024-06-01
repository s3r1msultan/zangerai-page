// // src/services/AuthService.ts
// import { auth } from "../configs/firebase-config";
// import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// declare global {
//   interface Window {
//     _recaptchaVerifier?: RecaptchaVerifier;
//     _confirmationResult?: ConfirmationResult;
//     _captchaWidgetId?: number;
//     grecaptcha?: {
//       reset: (widgetId: number) => any;
//     };
//   }
// }

export class AuthService {
  //   static initializeRecaptcha(containerId: string): void {
  //     if (window._recaptchaVerifier) {
  //       window._recaptchaVerifier.clear();
  //       document.getElementById(containerId)!.innerHTML = '<div id="recaptcha-container"></div>';
  //     }
  //     window._recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
  //       size: "invisible",
  //       callback: (response: any) => {
  //         console.log("reCAPTCHA solved:", response);
  //         window._captchaWidgetId = response;
  //       },
  //       "expired-callback": () => {
  //         console.log("reCAPTCHA expired, resetting...");
  //         window._recaptchaVerifier?.clear();
  //       },
  //     });
  //   }
  //   static async signInWithPhone(phoneNumber: string): Promise<void> {
  //     try {
  //       if (!window._recaptchaVerifier) {
  //         throw new Error("reCAPTCHA verifier is not initialized.");
  //       }
  //       const appVerifier = window._recaptchaVerifier;
  //       const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber.replace(/\s+/g, ""), appVerifier);
  //       window._confirmationResult = confirmationResult;
  //     } catch (error) {
  //       console.error("Error during phone number submission:", error);
  //       if (window._recaptchaVerifier) {
  //         window._recaptchaVerifier.clear();
  //       }
  //       throw error;
  //     }
  //   }
  //   static async confirmOtp(otp: string): Promise<void> {
  //     try {
  //       if (!window._confirmationResult) {
  //         throw new Error("Confirmation result is not available.");
  //       }
  //       await window._confirmationResult.confirm(otp);
  //     } catch (error) {
  //       console.error("Error during OTP verification:", error);
  //       throw error;
  //     }
  //   }
}

// export default AuthService;
