import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isNull } from './null-validation';

export class FormValidations {
  static ipv4Validator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const controlValue = control.value as string;

      if (ipValidator(controlValue)) {
        return { invalidIp: true };
      }
      return null;
    };
  }

  static portValidator() {
    const portRegex = /^([0-9]{1,4})$/;

    return (control: AbstractControl): ValidationErrors | null => {
      const controlValue = control.value as string;

      if (controlValue == null || controlValue === '') {
        return { invalidPort: true };
      }

      if (!portRegex.test(controlValue)) {
        return { invalidPort: true };
      }

      const portValue = Number(controlValue);
      if (portValue <= 0 || portValue > 65535) {
        return { invalidPort: true };
      }

      return null;
    };
  }

  static ipOrUrlValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const controlValue = control.value as string;
      const isIp = ipValidator(controlValue);
      const isUrl = urlValidator(controlValue);
      if (isIp && !isUrl) {
        return { invalidIpOrUrl: true };
      }
      return null;
    };
  }
}

const ipValidator = (value: string) => {
  const ipPattern = /^((25[0-5]|[0-1]?\d{1,2})\.){3}(25[0-5]|[0-1]?\d{1,2})$/;
  return !ipPattern.test(value);
};

const urlValidator = (value: string) => {
  const urlRegex = new RegExp(
    /^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
  );
  return isNull(value) || urlRegex.test(value);
};
