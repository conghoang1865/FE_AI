import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  InputComponent,
  SelectComponent,
  TextareaComponent,
  DateComponent,
  CheckboxComponent,
  RadioComponent,
  SelectOption,
  RadioOptionType,
} from './index';

@Component({
  selector: 'app-core-form-demo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    SelectComponent,
    TextareaComponent,
    DateComponent,
    CheckboxComponent,
    RadioComponent,
  ],
  template: `
    <div class="form-container">
      <h1>Core Form Components Demo</h1>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="demo-form">
        <!-- Text Input -->
        <app-input
          formControlName="firstName"
          label="First Name"
          [config]="{ placeholder: 'Enter your first name', required: true }"
          [hint]="'This field is required'"
        />

        <!-- Email Input -->
        <app-input
          formControlName="email"
          label="Email"
          [config]="{ type: 'email', placeholder: 'Enter your email', required: true }"
          [hint]="'Please provide a valid email address'"
        />

        <!-- Select -->
        <app-select
          formControlName="country"
          label="Country"
          [options]="countryOptions"
          [config]="{ placeholder: 'Select a country', required: true }"
          [hint]="'Choose your country of residence'"
        />

        <!-- Textarea -->
        <app-textarea
          formControlName="bio"
          label="Biography"
          [config]="{ rows: 5, maxLength: 500, placeholder: 'Tell us about yourself' }"
          [hint]="'Maximum 500 characters'"
        />

        <!-- Date -->
        <app-date
          formControlName="birthDate"
          label="Birth Date"
          [config]="{ required: true, type: 'date' }"
        />

        <!-- Checkbox -->
        <app-checkbox
          formControlName="agreeTerms"
          id="agree-terms"
          label="I agree to the terms and conditions"
          [hint]="'You must agree to continue'"
        />

        <!-- Radio -->
        <app-radio
          formControlName="gender"
          label="Gender"
          [options]="genderOptions"
          [config]="{ required: true }"
        />

        <!-- Submit Button -->
        <div class="form-actions">
          <button type="submit" class="submit-button" [disabled]="!form.valid">
            Submit Form
          </button>
          <button type="button" class="reset-button" (click)="onReset()">
            Reset
          </button>
        </div>

        <!-- Form State Display -->
        @if (submitted()) {
          <div class="form-result">
            <h3>Form Values:</h3>
            <pre>{{ form.value | json }}</pre>
          </div>
        }
      </form>
    </div>
  `,
  styles: `
    .form-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
      border-radius: 0.5rem;
      background-color: #f9fafb;
    }

    h1 {
      margin-bottom: 2rem;
      font-size: 1.875rem;
      color: #1f2937;
    }

    .demo-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }

    .submit-button,
    .reset-button {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: background-color 0.15s ease, opacity 0.15s ease;
      font-weight: 500;
    }

    .submit-button {
      background-color: #3b82f6;
      color: white;

      &:hover:not(:disabled) {
        background-color: #2563eb;
      }

      &:disabled {
        background-color: #9ca3af;
        cursor: not-allowed;
        opacity: 0.6;
      }
    }

    .reset-button {
      background-color: #e5e7eb;
      color: #1f2937;

      &:hover {
        background-color: #d1d5db;
      }
    }

    .form-result {
      margin-top: 2rem;
      padding: 1rem;
      background-color: #ecfdf5;
      border: 1px solid #86efac;
      border-radius: 0.375rem;
    }

    .form-result h3 {
      margin-top: 0;
      color: #166534;
    }

    .form-result pre {
      background-color: white;
      padding: 0.75rem;
      border-radius: 0.25rem;
      overflow-x: auto;
      font-size: 0.875rem;
      color: #1f2937;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoreFormDemoComponent {
  form: FormGroup;
  submitted = signal(false);

  countryOptions: SelectOption[] = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
  ];

  genderOptions: RadioOptionType[] = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      country: ['', Validators.required],
      bio: [''],
      birthDate: ['', Validators.required],
      agreeTerms: [false, Validators.requiredTrue],
      gender: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitted.set(true);
      console.log('Form submitted:', this.form.value);
    }
  }

  onReset(): void {
    this.form.reset();
    this.submitted.set(false);
  }
}
