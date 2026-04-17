# Core Form Components

This directory contains a set of reusable, accessible form components built with Angular 20+ following best practices for scalability, maintainability, and accessibility.

## Components

### InputComponent

A flexible text input component supporting various input types with validation and error handling.

**Properties:**
- `label` (required): The label text for the input
- `config` (optional): InputConfig object with:
  - `type`: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' (default: 'text')
  - `placeholder`: Placeholder text
  - `disabled`: Boolean to disable the input
  - `required`: Boolean to mark as required
  - `error`: Error message to display
  - `hint`: Helper text below the input
- `disabled` (optional): Override config disabled state
- `required` (optional): Override config required state
- `hint` (optional): Helper text
- `valueChange` (output): Emitted when value changes

**Usage:**
```typescript
<app-input
  formControlName="firstName"
  label="First Name"
  [config]="{ placeholder: 'Enter name', required: true }"
  [hint]="'2-50 characters'"
/>
```

---

### SelectComponent

A dropdown select component with optional multiple selection support.

**Properties:**
- `label` (required): The label text
- `options` (required): Array of SelectOption objects
  - `value`: string | number
  - `label`: Display text
  - `disabled`: Optional boolean
- `config` (optional): SelectConfig object with:
  - `placeholder`: Placeholder text
  - `disabled`: Boolean to disable the select
  - `required`: Boolean to mark as required
  - `error`: Error message
  - `hint`: Helper text
  - `multiple`: Boolean for multiple selection
- `selectionChange` (output): Emitted when selection changes

**Usage:**
```typescript
<app-select
  formControlName="country"
  label="Country"
  [options]="countryOptions"
  [config]="{ placeholder: 'Select country', required: true }"
/>
```

---

### TextareaComponent

A multi-line text input component with character counter support.

**Properties:**
- `label` (required): The label text
- `config` (optional): TextareaConfig object with:
  - `placeholder`: Placeholder text
  - `disabled`: Boolean to disable
  - `required`: Boolean to mark as required
  - `error`: Error message
  - `hint`: Helper text
  - `rows`: Number of visible rows (default: 4)
  - `cols`: Number of columns
  - `maxLength`: Maximum character limit
- `valueChange` (output): Emitted when value changes

**Usage:**
```typescript
<app-textarea
  formControlName="bio"
  label="Biography"
  [config]="{ rows: 5, maxLength: 500 }"
  [hint]="'Maximum 500 characters'"
/>
```

---

### DateComponent

A date/time input component supporting various date formats.

**Properties:**
- `label` (required): The label text
- `config` (optional): DateConfig object with:
  - `type`: 'date' | 'datetime-local' | 'time' | 'month' | 'week' (default: 'date')
  - `placeholder`: Placeholder text
  - `disabled`: Boolean to disable
  - `required`: Boolean to mark as required
  - `error`: Error message
  - `hint`: Helper text
  - `min`: Minimum date (ISO format)
  - `max`: Maximum date (ISO format)
- `valueChange` (output): Emitted when value changes

**Usage:**
```typescript
<app-date
  formControlName="birthDate"
  label="Birth Date"
  [config]="{ required: true, type: 'date', min: '1900-01-01', max: '2010-12-31' }"
/>
```

---

### CheckboxComponent

A single checkbox component with label and validation support.

**Properties:**
- `label` (required): The checkbox label text
- `id` (required): Unique identifier for the checkbox
- `config` (optional): CheckboxConfig object with:
  - `disabled`: Boolean to disable
  - `error`: Error message
  - `hint`: Helper text
- `valueChange` (output): Emitted when value changes

**Usage:**
```typescript
<app-checkbox
  formControlName="agreeTerms"
  id="agree-terms"
  label="I agree to terms and conditions"
  [hint]="'Required to continue'"
/>
```

---

### RadioComponent

A radio button group component for single selection among multiple options.

**Properties:**
- `label` (required): The fieldset legend text
- `options` (required): Array of RadioOption objects
  - `value`: string | number
  - `label`: Display text
  - `disabled`: Optional boolean
- `config` (optional): RadioConfig object with:
  - `disabled`: Boolean to disable all radios
  - `required`: Boolean to mark as required
  - `error`: Error message
  - `hint`: Helper text
- `selectionChange` (output): Emitted when selection changes

**Usage:**
```typescript
<app-radio
  formControlName="gender"
  label="Gender"
  [options]="genderOptions"
  [config]="{ required: true }"
/>
```

---

## Best Practices

### Reactive Forms Integration

All components implement `ControlValueAccessor`, making them fully compatible with reactive forms:

```typescript
constructor(private fb: FormBuilder) {
  this.form = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    agreeTerms: [false, Validators.requiredTrue],
  });
}
```

### Accessibility

- All components include proper ARIA attributes
- Support keyboard navigation
- Display validation errors as alerts
- Use semantic HTML elements
- Meet WCAG AA standards

### Styling

- Consistent spacing and typography
- Focus indicators for keyboard navigation
- Error states with visual feedback
- Disabled states clearly indicated
- Responsive design

### Type Safety

All configuration objects are fully typed with TypeScript interfaces:
- `InputConfig`, `SelectConfig`, `TextareaConfig`, `DateConfig`, `CheckboxConfig`, `RadioConfig`
- `SelectOption`, `RadioOption` for option arrays

---

## Import

Export all components and types from the index:

```typescript
import {
  InputComponent,
  SelectComponent,
  TextareaComponent,
  DateComponent,
  CheckboxComponent,
  RadioComponent,
  type InputConfig,
  type SelectOption,
  type RadioOptionType,
} from './core';
```

---

## Example

See [form-demo.component.ts](./form-demo.component.ts) for a complete working example showing all components integrated with a reactive form.

---

## Features

✅ Standalone components (Angular 20+ default)  
✅ ControlValueAccessor implementation  
✅ Change detection strategy: OnPush  
✅ Signals-based state management  
✅ Full TypeScript support  
✅ WCAG AA accessible  
✅ AXE audit compliant  
✅ Reactive forms ready  
✅ Complete validation support  
✅ Customizable styling via CSS variables  
✅ Color contrast compliant  
✅ Focus management  
✅ Error and hint messaging  
