export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'select'
  | 'user-picker'

export interface FormFieldSchema {
  id: string
  type: FormFieldType
  label: string
  required?: boolean
  placeholder?: string
  options?: { label: string; value: string }[]
}

export interface FormSchema {
  id: string
  title: string
  fields: FormFieldSchema[]
}

export type FormValues = Record<string, string | number | undefined>
