import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

export interface FormFieldConfig {
  value?: unknown;
  disabled?: boolean;
  validators?: unknown[];
}

export interface FormConfig {
  [key: string]: FormFieldConfig;
}

@Injectable({
  providedIn: 'root',
})
export class FormUtilityService {
  constructor(private readonly formBuilder: FormBuilder) {}

  /**
   * Create a form group from configuration
   */
  createFormGroup(config: FormConfig): FormGroup {
    const group: Record<string, [unknown, unknown]> = {};

    for (const [key, fieldConfig] of Object.entries(config)) {
      const validators = fieldConfig.validators || [];
      group[key] = [
        { value: fieldConfig.value || '', disabled: fieldConfig.disabled || false },
        validators,
      ];
    }

    return this.formBuilder.group(group);
  }

  /**
   * Get all form validation errors
   */
  getFormErrors(form: FormGroup): Record<string, ValidationErrors | null> {
    const errors: Record<string, ValidationErrors | null> = {};

    Object.keys(form.controls).forEach((key) => {
      const control = form.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });

    return errors;
  }

  /**
   * Check if form has any errors
   */
  hasErrors(form: FormGroup): boolean {
    return Object.keys(this.getFormErrors(form)).length > 0;
  }

  /**
   * Mark all fields as touched
   */
  markAllFieldsAsTouched(form: FormGroup): void {
    Object.keys(form.controls).forEach((key) => {
      const control = form.get(key);
      if (control) {
        control.markAsTouched();
        if (control instanceof FormGroup) {
          this.markAllFieldsAsTouched(control);
        }
      }
    });
  }

  /**
   * Reset form to initial state
   */
  resetForm(form: FormGroup): void {
    form.reset();
    Object.keys(form.controls).forEach((key) => {
      const control = form.get(key);
      if (control) {
        control.markAsPristine();
        control.markAsUntouched();
      }
    });
  }

  /**
   * Get form data excluding disabled fields
   */
  getFormData(form: FormGroup): Record<string, unknown> {
    return form.getRawValue();
  }

  /**
   * Populate form with data
   */
  populateForm(form: FormGroup, data: Record<string, unknown>): void {
    Object.keys(data).forEach((key) => {
      const control = form.get(key);
      if (control) {
        control.setValue(data[key]);
      }
    });
  }

  /**
   * Check if a specific field has an error
   */
  hasFieldError(form: FormGroup, fieldName: string, errorType?: string): boolean {
    const control = form.get(fieldName);
    if (!control) {
      return false;
    }
    if (errorType) {
      return control.hasError(errorType) && (control.dirty || control.touched);
    }
    return control.invalid && (control.dirty || control.touched);
  }

  /**
   * Disable form group
   */
  disableForm(form: FormGroup): void {
    form.disable();
  }

  /**
   * Enable form group
   */
  enableForm(form: FormGroup): void {
    form.enable();
  }
}
