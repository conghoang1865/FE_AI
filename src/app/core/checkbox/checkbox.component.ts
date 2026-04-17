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

export interface CheckboxConfig {
  disabled?: boolean;
  error?: string;
  hint?: string;
}

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="checkbox-wrapper">
      <div class="checkbox-input-wrapper">
        <input
          type="checkbox"
          [id]="id()"
          [checked]="value()"
          [disabled]="isDisabled() || config().disabled"
          class="checkbox-field"
          [attr.aria-label]="label()"
          [attr.aria-invalid]="hasError()"
          [attr.aria-describedby]="hint() ? id() + '-hint' : config().error ? id() + '-error' : null"
          (change)="onChange($event)"
          (blur)="onTouched()"
        />
        <label [htmlFor]="id()" class="checkbox-label">
          {{ label() }}
        </label>
      </div>
      @if (hint()) {
        <div [id]="id() + '-hint'" class="checkbox-hint">
          {{ hint() }}
        </div>
      }
      @if (hasError()) {
        <div [id]="id() + '-error'" class="checkbox-error-message" role="alert">
          {{ config().error }}
        </div>
      }
    </div>
  `,
  styles: `
    .checkbox-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .checkbox-input-wrapper {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .checkbox-field {
      width: 1.25rem;
      height: 1.25rem;
      cursor: pointer;
      accent-color: #3b82f6;
      border: 1px solid #d1d5db;
      border-radius: 0.25rem;

      &:focus {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
    }

    .checkbox-label {
      font-size: 1rem;
      line-height: 1.5;
      color: #1f2937;
      cursor: pointer;
      user-select: none;
    }

    .checkbox-hint {
      font-size: 0.875rem;
      color: #6b7280;
      margin-left: 1.75rem;
    }

    .checkbox-error-message {
      font-size: 0.875rem;
      color: #dc2626;
      margin-left: 1.75rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
  host: {
    class: 'app-checkbox',
  },
})
export class CheckboxComponent implements ControlValueAccessor {
  label = input.required<string>();
  id = input.required<string>();
  config = input<CheckboxConfig>({});
  disabled = input(false);
  hint = input<string | undefined>();
  valueChange = output<boolean>();

  protected value = signal(false);
  private touched = signal(false);
  private internalDisabled = signal(false);

   isDisabled = (): boolean => this.disabled() || this.internalDisabled();
  hasError = (): boolean => this.touched() && !!this.config().error;

  onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.checked);
    this.onChangeCallback(this.value());
    this.valueChange.emit(this.value());
  }

  onTouched(): void {
    this.touched.set(true);
    this.onTouchedCallback();
  }

  // ControlValueAccessor methods
  writeValue(value: boolean): void {
    this.value.set(value || false);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.internalDisabled.set(isDisabled);
  }

  private onChangeCallback: (value: boolean) => void = () => {};
  private onTouchedCallback: () => void = () => {};
}
