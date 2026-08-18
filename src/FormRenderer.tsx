import { useMemo, useState } from 'react'
import type { FieldSchema, FormValues, FormSchema } from './types'
import './form.css'

export interface FormRendererProps {
  /** 布局 Schema：designer 的核心产物，包含 name + 布局类型 + fields */
  schema: FormSchema
  initialValues?: FormValues
  readOnly?: boolean
  onSubmit?: (values: FormValues) => void
}

/** 字段类型是否需要收集用户输入（对应 FieldSchema 中的 id 参与 FormValues） */
function isInputField(field: FieldSchema): boolean {
  switch (field.type) {
    case 'text':
    case 'textarea':
    case 'number':
    case 'date':
    case 'date-range':
    case 'select':
    case 'radio':
    case 'checkbox':
    case 'user-picker':
    case 'upload':
      return true
    default:
      return false
  }
}

export function FormRenderer({
  schema,
  initialValues = {},
  readOnly = false,
  onSubmit,
}: FormRendererProps) {
  const { layout: layoutSchema } = schema
  const [values, setValues] = useState<FormValues>(initialValues)

  // 布局模式：grid 的列数
  const columns: number = useMemo(() => {
    if (layoutSchema.type === 'grid' && typeof layoutSchema.columns === 'number' && layoutSchema.columns > 0) {
      return Math.min(6, layoutSchema.columns)
    }
    return 1
  }, [layoutSchema.type, layoutSchema.columns])

  function updateField(id: string, value: string | number | (string | number)[]) {
    setValues((prev) => ({ ...prev, [id]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit?.(values)
  }

  return (
    <form
      className={`oa-form oa-form--layout-${layoutSchema.type}`}
      onSubmit={handleSubmit}
      style={
        layoutSchema.type === 'grid'
          ? ({
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              gap: 16,
            } as React.CSSProperties)
          : undefined
      }
    >
      <header className="oa-form__header" style={{ gridColumn: `1 / -1` }}>
        <h2 className="oa-form__title">{layoutSchema.name}</h2>
        <span className="oa-form__meta">布局引擎 · oa-form</span>
      </header>

      {layoutSchema.fields.map((field) => {
        const spanCol =
          layoutSchema.type === 'grid' && typeof field.colSpan === 'number'
            ? { gridColumn: `span ${Math.min(field.colSpan, columns)} / span ${Math.min(field.colSpan, columns)}` }
            : undefined

        // ---------- 展示类字段 ----------
        if (field.type === 'heading') {
          return (
            <div key={field.id} className="oa-form__display oa-form__display--heading" style={spanCol}>
              <h3>{field.content || field.label}</h3>
            </div>
          )
        }
        if (field.type === 'paragraph') {
          return (
            <div key={field.id} className="oa-form__display oa-form__display--paragraph" style={spanCol}>
              <p>{field.content ?? ''}</p>
            </div>
          )
        }
        if (field.type === 'divider') {
          return (
            <div key={field.id} className="oa-form__display oa-form__display--divider" style={spanCol}>
              <hr />
            </div>
          )
        }
        if (field.type === 'image') {
          return (
            <div key={field.id} className="oa-form__display oa-form__display--image" style={spanCol}>
              {field.content ? (
                <img src={field.content} alt={field.label} style={{ maxWidth: '100%' }} />
              ) : (
                <span style={{ color: '#999' }}>[图片占位]</span>
              )}
            </div>
          )
        }

        // ---------- 输入类字段 ----------
        if (!isInputField(field)) {
          // 未知字段类型：降级展示 label
          return (
            <div key={field.id} className="oa-form__field" style={spanCol}>
              <span className="oa-form__label">{field.label}</span>
              <div className="oa-form__unknown">不支持的字段类型：{field.type}</div>
            </div>
          )
        }

        const common = {
          id: field.id,
          disabled: readOnly,
          placeholder: field.placeholder,
          required: field.required,
        }

        return (
          <label key={field.id} className="oa-form__field" style={spanCol}>
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
            ) : field.type === 'radio' ? (
              <div className="oa-form__radio-group">
                {(field.options ?? []).map((opt) => (
                  <label key={opt.value} className="oa-form__radio">
                    <input
                      type="radio"
                      name={field.id}
                      value={opt.value}
                      checked={String(values[field.id] ?? '') === opt.value}
                      disabled={readOnly}
                      onChange={(e) => updateField(field.id, e.target.value)}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            ) : field.type === 'checkbox' ? (
              <div className="oa-form__checkbox-group">
                {(field.options ?? []).map((opt) => {
                  const arr = Array.isArray(values[field.id]) ? (values[field.id] as (string | number)[]) : []
                  const checked = arr.includes(opt.value)
                  return (
                    <label key={opt.value} className="oa-form__checkbox">
                      <input
                        type="checkbox"
                        value={opt.value}
                        checked={checked}
                        disabled={readOnly}
                        onChange={() => {
                          const next = checked ? arr.filter((v) => v !== opt.value) : [...arr, opt.value]
                          updateField(field.id, next)
                        }}
                      />
                      {opt.label}
                    </label>
                  )
                })}
              </div>
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
                    field.type === 'number' ? Number(e.target.value) : e.target.value,
                  )
                }
              />
            )}
          </label>
        )
      })}

      {!readOnly && onSubmit ? (
        <footer className="oa-form__footer" style={{ gridColumn: `1 / -1` }}>
          <button type="submit" className="oa-form__submit">
            提交
          </button>
        </footer>
      ) : null}
    </form>
  )
}
