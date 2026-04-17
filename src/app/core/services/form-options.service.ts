import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class FormOptionsService {
  private readonly countryOptionsSignal = signal<SelectOption[]>([
    { label: 'United States', value: 'us' },
    { label: 'Canada', value: 'ca' },
    { label: 'United Kingdom', value: 'uk' },
    { label: 'Australia', value: 'au' },
    { label: 'Germany', value: 'de' },
    { label: 'France', value: 'fr' },
    { label: 'Japan', value: 'jp' },
    { label: 'India', value: 'in' },
    { label: 'Brazil', value: 'br' },
    { label: 'Mexico', value: 'mx' },
  ]);

  private readonly genderOptionsSignal = signal<SelectOption[]>([
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
    { label: 'Prefer not to say', value: 'not-say' },
  ]);

  readonly countryOptions = this.countryOptionsSignal.asReadonly();
  readonly genderOptions = this.genderOptionsSignal.asReadonly();

  getCountries(): SelectOption[] {
    return this.countryOptionsSignal();
  }

  getGenders(): SelectOption[] {
    return this.genderOptionsSignal();
  }

  setCountryOptions(options: SelectOption[]): void {
    this.countryOptionsSignal.set(options);
  }

  setGenderOptions(options: SelectOption[]): void {
    this.genderOptionsSignal.set(options);
  }
}
