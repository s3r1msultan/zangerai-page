/// <reference types="react-scripts" />
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
