import { useState } from 'react'
import type { FormSchema, FormValues } from './types'
import './form.css'

export interface FormRendererProps {
  schema: FormSchema
  initialValues?: FormValues
  readOnly?: boolean
  onSubmit?: (values: FormValues) => void
}

export function FormRenderer({
  schema,
  initialValues = {},
  readOnly = false,
  onSubmit,
}: FormRendererProps) {
  const [values, setValues] = useState<FormValues>(initialValues)

  function updateField(id: string, value: string | number) {
    setValues((prev) => ({ ...prev, [id]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit?.(values)
  }

  return (
    <form className="oa-form" onSubmit={handleSubmit}>
      <header className="oa-form__header">
        <h2 className="oa-form__title">{schema.title}</h2>
        <span className="oa-form__meta">表单引擎 · oa-form</span>
      </header>
      <div className="oa-form__body">
        {schema.fields.map((field) => {
          const common = {
            id: field.id,
            disabled: readOnly,
            placeholder: field.placeholder,
            required: field.required,
          }

          return (
            <label key={field.id} className="oa-form__field">
              <span className="oa-form__label">
                {field.label}
                {field.required ? <em>*</em> : null}
              </span>
              {field.type === 'textarea' ? (
                <textarea
                  {...common}
                  rows={3}
                  value={String(values[field.id] ?? '')}
                  onChange={(e) => updateField(field.id, e.target.value)}
                />
              ) : field.type === 'select' ? (
                <select
                  {...common}
                  value={String(values[field.id] ?? '')}
                  onChange={(e) => updateField(field.id, e.target.value)}
                >
                  <option value="">请选择</option>
                  {(field.options ?? []).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  {...common}
                  type={
                    field.type === 'number'
                      ? 'number'
                      : field.type === 'date'
                        ? 'date'
                        : 'text'
                  }
                  value={String(values[field.id] ?? '')}
                  onChange={(e) =>
                    updateField(
                      field.id,
                      field.type === 'number'
                        ? Number(e.target.value)
                        : e.target.value,
                    )
                  }
                />
              )}
            </label>
          )
        })}
      </div>
      {!readOnly && onSubmit ? (
        <footer className="oa-form__footer">
          <button type="submit" className="oa-form__submit">
            提交
          </button>
        </footer>
      ) : null}
    </form>
  )
}
