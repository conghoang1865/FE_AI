import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  HostListener,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

export interface InputConfig {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
}

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="input-wrapper">
      <label [htmlFor]="label()" class="input-label">
        {{ label() }}
        @if (required()) {
          <span class="required-indicator" aria-label="required">*</span>
        }
      </label>
      <input
        #inputRef
        [id]="label()"
        [type]="config().type || 'text'"
        [placeholder]="config().placeholder || ''"
        [disabled]="isDisabled() || config().disabled"
        [required]="config().required || required()"
        class="input-field"
        [class.input-error]="hasError()"
        [attr.aria-label]="label()"
        [attr.aria-required]="required()"
        [attr.aria-invalid]="hasError()"
        [attr.aria-describedby]="hint() ? label() + '-hint' : config().error ? label() + '-error' : null"
        (input)="onInput($event)"
        (blur)="onTouched()"
        (change)="valueChange.emit($event)"
      />
      @if (hint()) {
        <div [id]="label() + '-hint'" class="input-hint">
          {{ hint() }}
        </div>
      }
      @if (hasError()) {
        <div [id]="label() + '-error'" class="input-error-message" role="alert">
          {{ config().error }}
        </div>
      }
    </div>
  `,
  styles: `
    .input-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .input-label {
      font-weight: 500;
      font-size: 0.9375rem;
      line-height: 1.5;
      color: #1f2937;
    }

    .required-indicator {
      color: #dc2626;
      margin-left: 0.25rem;
    }

    .input-field {
      padding: 0.625rem 0.875rem;
      font-size: 1rem;
      line-height: 1.5;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
      font-family: inherit;

      &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      &:disabled {
        background-color: #f3f4f6;
        color: #9ca3af;
        cursor: not-allowed;
      }

      &.input-error {
        border-color: #dc2626;

        &:focus {
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }
      }
    }

    .input-hint {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .input-error-message {
      font-size: 0.875rem;
      color: #dc2626;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  host: {
    class: 'app-input',
  },
})
export class InputComponent implements ControlValueAccessor {
  label = input.required<string>();
  config = input<InputConfig>({});
  disabled = input(false);
  required = input(false);
  hint = input<string | undefined>();
  valueChange = output<Event>();

  protected value = signal('');
  private touched = signal(false);
  private internalDisabled = signal(false);

   isDisabled = (): boolean => this.disabled() || this.internalDisabled();
  hasError = (): boolean => this.touched() && !!this.config().error;

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
    this.onChange(this.value());
  }

  onTouched(): void {
    this.touched.set(true);
    this.onTouchedCallback();
  }

  // ControlValueAccessor methods
  writeValue(value: string): void {
    this.value.set(value || '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.internalDisabled.set(isDisabled);
  }

  private onChange: (value: string) => void = () => {};
  private onTouchedCallback: () => void = () => {};
}
