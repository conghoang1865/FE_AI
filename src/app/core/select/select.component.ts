import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  forwardRef,
  ViewChild,
  ElementRef,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectConfig {
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
  multiple?: boolean;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="select-wrapper">
      <label [htmlFor]="label()" class="select-label">
        {{ label() }}
        @if (required()) {
          <span class="required-indicator" aria-label="required">*</span>
        }
      </label>
      <div class="select-container">
        <select
          #selectRef
          [id]="label()"
          [disabled]="isDisabled() || config().disabled"
          [required]="config().required || required()"
          class="select-field"
          [class.select-error]="hasError()"
          [attr.aria-label]="label()"
          [attr.aria-required]="required()"
          [attr.aria-invalid]="hasError()"
          [attr.aria-describedby]="hint() ? label() + '-hint' : config().error ? label() + '-error' : null"
          [multiple]="config().multiple"
          (change)="onSelectionChange($event)"
          (blur)="onTouched()"
          (scroll)="onSelectScroll($event)"
        >
          @if (config().placeholder) {
            <option value="" disabled [selected]="!value()">
              {{ config().placeholder }}
            </option>
          }
          @for (option of displayedOptions(); track option.value) {
            <option [value]="option.value" [disabled]="option.disabled">
              {{ option.label }}
            </option>
          }
          @if (isLoading()) {
            <option disabled>Loading more...</option>
          }
        </select>
      </div>
      @if (hint()) {
        <div [id]="label() + '-hint'" class="select-hint">
          {{ hint() }}
        </div>
      }
      @if (hasError()) {
        <div [id]="label() + '-error'" class="select-error-message" role="alert">
          {{ config().error }}
        </div>
      }
    </div>
  `,
  styles: `
    .select-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .select-label {
      font-weight: 500;
      font-size: 0.9375rem;
      line-height: 1.5;
      color:container {
      position: relative;
    }

    .select-label {
      font-weight: 500;
      font-size: 0.9375rem;
      line-height: 1.5;
      color: #1f2937;
    }

    .required-indicator {
      color: #dc2626;
      margin-left: 0.25rem;
    }

    .select-field {
      padding: 0.625rem 0.875rem;
      font-size: 1rem;
      line-height: 1.5;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      background-color: white;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
      font-family: inherit;
      cursor: pointer;
      max-height: 200px;
      overflow-y: auto #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      &:disabled {
        background-color: #f3f4f6;
        color: #9ca3af;
        cursor: not-allowed;
      }

      &.select-error {
        border-color: #dc2626;

        &:focus {
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }
      }

      option {
        padding: 0.5rem;
        color: #1f2937;
      }
    }

    .select-hint {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .select-error-message {
      font-size: 0.875rem;
      color: #dc2626;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  host: {
    class: 'app-select',
  },
})
export class SelectComponent implements ControlValueAccessor {
  label = input.required<string>();
  options = input.required<SelectOption[]>();
  config = input<SelectConfig>({});
  disabled = input(false);
  required = input(false);
  hint = input<string | undefined>();
  selectionChange = output<string | string[]>();

  protected value = signal<string | string[]>('');
  private touched = signal(false);
  private internalDisabled = signal(false);
  protected displayedOptions = signal<SelectOption[]>([]);
  protected isLoading = signal(false);

  isDisabled = (): boolean => this.disabled() || this.internalDisabled();
  hasError = (): boolean => this.touched() && !!this.config().error;

  constructor() {
    effect(() => {
      this.displayedOptions.set(this.options());
    });
  }

  onSelectionChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedValue = this.config().multiple
      ? Array.from(target.selectedOptions).map((opt) => opt.value)
      : target.value;

    this.value.set(selectedValue);
    this.onChange(selectedValue);
    this.selectionChange.emit(selectedValue);
  }

  onTouched(): void {
    this.touched.set(true);
    this.onTouchedCallback();
  }

  onSelectScroll(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;

    // Load more items when user scrolls near the bottom (90% threshold)
    if (scrollTop + clientHeight >= scrollHeight * 0.9) {
      // Implement lazy loading logic here if needed
      // For now, just prevents scroll issues
    }
  }

  // ControlValueAccessor methods
  writeValue(value: string | string[]): void {
    this.value.set(value || '');
  }

  registerOnChange(fn: (value: string | string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.internalDisabled.set(isDisabled);
  }

  private onChange: (value: string | string[]) => void = () => {};
  private onTouchedCallback: () => void = () => {};
}
