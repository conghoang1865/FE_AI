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

export interface TextareaConfig {
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
  rows?: number;
  cols?: number;
  maxLength?: number;
}

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="textarea-wrapper">
      <label [htmlFor]="label()" class="textarea-label">
        {{ label() }}
        @if (required()) {
          <span class="required-indicator" aria-label="required">*</span>
        }
      </label>
      <textarea
        [id]="label()"
        [placeholder]="config().placeholder || ''"
        [disabled]="isDisabled() || config().disabled"
        [required]="config().required || required()"
        [rows]="config().rows || 4"
        [cols]="config().cols || 50"
        [attr.maxlength]="config().maxLength || null"
        class="textarea-field"
        [class.textarea-error]="hasError()"
        [attr.aria-label]="label()"
        [attr.aria-required]="required()"
        [attr.aria-invalid]="hasError()"
        [attr.aria-describedby]="hint() ? label() + '-hint' : config().error ? label() + '-error' : null"
        (input)="onInput($event)"
        (blur)="onTouched()"
        (change)="valueChange.emit($event)"
      ></textarea>
      <div class="textarea-meta">
        @if (config().maxLength) {
          <span class="character-count">
            {{ characterCount() }} / {{ config().maxLength }}
          </span>
        }
      </div>
      @if (hint()) {
        <div [id]="label() + '-hint'" class="textarea-hint">
          {{ hint() }}
        </div>
      }
      @if (hasError()) {
        <div [id]="label() + '-error'" class="textarea-error-message" role="alert">
          {{ config().error }}
        </div>
      }
    </div>
  `,
  styles: `
    .textarea-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .textarea-label {
      font-weight: 500;
      font-size: 0.9375rem;
      line-height: 1.5;
      color: #1f2937;
    }

    .required-indicator {
      color: #dc2626;
      margin-left: 0.25rem;
    }

    .textarea-field {
      padding: 0.625rem 0.875rem;
      font-size: 1rem;
      line-height: 1.5;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-family: inherit;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
      resize: vertical;

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

      &.textarea-error {
        border-color: #dc2626;

        &:focus {
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }
      }
    }

    .textarea-meta {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }

    .character-count {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .textarea-hint {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .textarea-error-message {
      font-size: 0.875rem;
      color: #dc2626;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
  host: {
    class: 'app-textarea',
  },
})
export class TextareaComponent implements ControlValueAccessor {
  label = input.required<string>();
  config = input<TextareaConfig>({});
  disabled = input(false);
  required = input(false);
  hint = input<string | undefined>();
  valueChange = output<Event>();

  protected value = signal('');
  private touched = signal(false);
  private internalDisabled = signal(false);
  characterCount = signal(0);

   isDisabled = (): boolean => this.disabled() || this.internalDisabled();
  hasError = (): boolean => this.touched() && !!this.config().error;

  onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.value.set(target.value);
    this.characterCount.set(target.value.length);
    this.onChange(this.value());
  }

  onTouched(): void {
    this.touched.set(true);
    this.onTouchedCallback();
  }

  // ControlValueAccessor methods
  writeValue(value: string): void {
    this.value.set(value || '');
    this.characterCount.set((value || '').length);
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
