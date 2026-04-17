import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

export interface RadioOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface RadioConfig {
  disabled?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
}

@Component({
  selector: 'app-radio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <fieldset class="radio-wrapper">
      <legend class="radio-legend">
        {{ label() }}
        @if (required()) {
          <span class="required-indicator" aria-label="required">*</span>
        }
      </legend>
      <div class="radio-group">
        @for (option of options(); track option.value) {
          <div class="radio-item">
            <input
              type="radio"
              [id]="label() + '-' + option.value"
              [value]="option.value"
              [checked]="value() === option.value"
              [disabled]="option.disabled || isDisabled() || config().disabled"
              [required]="config().required || required()"
              class="radio-field"
              [attr.aria-label]="option.label"
              [attr.aria-invalid]="hasError()"
              (change)="onSelect(option.value)"
              (blur)="onTouched()"
            />
            <label [htmlFor]="label() + '-' + option.value" class="radio-label">
              {{ option.label }}
            </label>
          </div>
        }
      </div>
      @if (hint()) {
        <div class="radio-hint">
          {{ hint() }}
        </div>
      }
      @if (hasError()) {
        <div class="radio-error-message" role="alert">
          {{ config().error }}
        </div>
      }
    </fieldset>
  `,
  styles: `
    .radio-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      border: none;
      padding: 0;
      margin: 0;
    }

    .radio-legend {
      font-weight: 500;
      font-size: 0.9375rem;
      line-height: 1.5;
      color: #1f2937;
      padding: 0;
      margin: 0;
    }

    .required-indicator {
      color: #dc2626;
      margin-left: 0.25rem;
    }

    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .radio-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .radio-field {
      width: 1.25rem;
      height: 1.25rem;
      cursor: pointer;
      accent-color: #3b82f6;
      border: 1px solid #d1d5db;

      &:focus {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
    }

    .radio-label {
      font-size: 1rem;
      line-height: 1.5;
      color: #1f2937;
      cursor: pointer;
      user-select: none;
    }

    .radio-hint {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .radio-error-message {
      font-size: 0.875rem;
      color: #dc2626;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioComponent),
      multi: true,
    },
  ],
  host: {
    class: 'app-radio',
  },
})
export class RadioComponent implements ControlValueAccessor {
  label = input.required<string>();
  options = input.required<RadioOption[]>();
  config = input<RadioConfig>({});
  disabled = input(false);
  required = input(false);
  hint = input<string | undefined>();
  selectionChange = output<string | number>();

  protected value = signal<string | number>('');
  private touched = signal(false);
  private internalDisabled = signal(false);

   isDisabled = (): boolean => this.disabled() || this.internalDisabled();
  hasError = (): boolean => this.touched() && !!this.config().error;

  onSelect(optionValue: string | number): void {
    this.value.set(optionValue);
    this.onChangeCallback(this.value());
    this.selectionChange.emit(this.value());
  }

  onTouched(): void {
    this.touched.set(true);
    this.onTouchedCallback();
  }

  // ControlValueAccessor methods
  writeValue(value: string | number): void {
    this.value.set(value || '');
  }

  registerOnChange(fn: (value: string | number) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.internalDisabled.set(isDisabled);
  }

  private onChangeCallback: (value: string | number) => void = () => {};
  private onTouchedCallback: () => void = () => {};
}
