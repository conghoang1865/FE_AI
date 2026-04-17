import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormValidationService {
  /**
   * Validates email format
   */
  emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(control.value) ? null : { invalidEmail: true };
    };
  }

  /**
   * Validates password strength
   * Requirements: at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
   */
  passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const password = control.value;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumeric = /[0-9]/.test(password);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
      const isLongEnough = password.length >= 8;

      const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar && isLongEnough;

      return passwordValid ? null : { weakPassword: true };
    };
  }

  /**
   * Validates phone number format
   */
  phoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      return phoneRegex.test(control.value.replace(/\s/g, '')) ? null : { invalidPhone: true };
    };
  }

  /**
   * Validates URL format
   */
  urlValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      try {
        new URL(control.value);
        return null;
      } catch {
        return { invalidUrl: true };
      }
    };
  }

  /**
   * Validates minimum age
   */
  minAgeValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const birthDate = new Date(control.value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age >= minAge ? null : { minAge: { requiredAge: minAge, actualAge: age } };
    };
  }

  /**
   * Validates that two password fields match
   */
  passwordMatchValidator(passwordField: string, confirmPasswordField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(passwordField);
      const confirmPassword = control.get(confirmPasswordField);

      if (!password || !confirmPassword) {
        return null;
      }

      return password.value === confirmPassword.value ? null : { passwordMismatch: true };
    };
  }

  /**
   * Get error message for a validation error
   */
  getErrorMessage(
    controlName: string,
    errors: ValidationErrors | null
  ): string | null {
    if (!errors) {
      return null;
    }

    if (errors['required']) {
      return `${this.formatFieldName(controlName)} is required`;
    }
    if (errors['invalidEmail']) {
      return 'Please enter a valid email address';
    }
    if (errors['weakPassword']) {
      return 'Password must contain uppercase, lowercase, number, and special character';
    }
    if (errors['invalidPhone']) {
      return 'Please enter a valid phone number';
    }
    if (errors['invalidUrl']) {
      return 'Please enter a valid URL';
    }
    if (errors['minAge']) {
      return `You must be at least ${errors['minAge'].requiredAge} years old`;
    }
    if (errors['passwordMismatch']) {
      return 'Passwords do not match';
    }
    if (errors['minlength']) {
      return `${this.formatFieldName(controlName)} must be at least ${errors['minlength'].requiredLength} characters`;
    }
    if (errors['maxlength']) {
      return `${this.formatFieldName(controlName)} must not exceed ${errors['maxlength'].requiredLength} characters`;
    }

    return 'Invalid input';
  }

  /**
   * Format field name for display
   */
  private formatFieldName(fieldName: string): string {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }
}
