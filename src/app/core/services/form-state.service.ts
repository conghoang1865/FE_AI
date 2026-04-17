import { Injectable, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormStateService {
  private readonly submittedSignal = signal<boolean>(false);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorMessageSignal = signal<string | null>(null);

  readonly submitted = this.submittedSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly errorMessage = this.errorMessageSignal.asReadonly();

  resetFormState(): void {
    this.submittedSignal.set(false);
    this.loadingSignal.set(false);
    this.errorMessageSignal.set(null);
  }

  setSubmitted(value: boolean): void {
    this.submittedSignal.set(value);
  }

  setLoading(value: boolean): void {
    this.loadingSignal.set(value);
  }

  setErrorMessage(message: string | null): void {
    this.errorMessageSignal.set(message);
  }

  submitForm(form: FormGroup, onSubmit: (data: Record<string, unknown>) => void): void {
    if (!form.valid) {
      this.setErrorMessage('Please fill in all required fields correctly.');
      return;
    }

    this.setSubmitted(true);
    this.setLoading(true);

    try {
      onSubmit(form.value);
      this.setErrorMessage(null);
    } catch (error) {
      this.setErrorMessage(
        error instanceof Error ? error.message : 'An error occurred while submitting the form.'
      );
    } finally {
      this.setLoading(false);
    }
  }

  reset(): void {
    this.resetFormState();
  }
}
