import { useMemo, useState } from 'react'
import { Button as AntButton } from 'antd'
import type { FormSchema, FormValues } from './types'
import { getWidget } from './widgets'
import './form.css'

export interface FormRendererProps {
  /** 完整的表单 Schema：包含 id/name/layout（LayoutSchema）等业务字段 */
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

  const layout = schema.layout

  // 布局模式：grid 的列数
  const columns: number = useMemo(() => {
    if (layout.type === 'grid' && typeof layout.columns === 'number' && layout.columns > 0) {
      return Math.min(6, layout.columns)
    }
    return 1
  }, [layout.type, layout.columns])

  function updateField(id: string, value: string | number | (string | number)[]) {
    setValues((prev) => ({ ...prev, [id]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit?.(values)
  }

  return (
    <form
      className={`oa-form oa-form--layout-${layout.type}`}
      onSubmit={handleSubmit}
      style={
        layout.type === 'grid'
          ? ({
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              gap: 16,
            } as React.CSSProperties)
          : undefined
      }
    >
      <header className="oa-form__header" style={{ gridColumn: `1 / -1` }}>
        <h2 className="oa-form__title">{schema.name}</h2>
        <span className="oa-form__meta">布局引擎 · oa-form</span>
      </header>

      {layout.fields.map((field) => {
        const widget = getWidget(field.type)

        const spanCol =
          layout.type === 'grid' && typeof field.colSpan === 'number'
            ? { gridColumn: `span ${Math.min(field.colSpan, columns)} / span ${Math.min(field.colSpan, columns)}` }
            : undefined

        // 未注册的字段类型：降级展示
        if (!widget) {
          return (
            <div key={field.id} className="oa-form__field" style={spanCol}>
              <span className="oa-form__label">{field.label}</span>
              <div className="oa-form__unknown">不支持的字段类型：{field.type}</div>
            </div>
          )
        }

        // 展示类字段：直接渲染 RuntimeView，不参与表单值收集
        if (widget.category === 'display') {
          return (
            <div key={field.id} style={spanCol}>
              <widget.RuntimeView field={field} readOnly={readOnly} />
            </div>
          )
        }

        // 输入类字段：渲染 label + RuntimeView，参与表单值收集
        return (
          <div key={field.id} className="oa-form__field" style={spanCol}>
            <span className="oa-form__label">
              {field.label}
              {field.required ? <em>*</em> : null}
            </span>
            <widget.RuntimeView
              field={field}
              value={values[field.id]}
              onChange={(v) => updateField(field.id, v)}
              readOnly={readOnly}
            />
          </div>
        )
      })}

      {!readOnly && onSubmit ? (
        <footer className="oa-form__footer" style={{ gridColumn: `1 / -1` }}>
          <AntButton type="primary" htmlType="submit">
            提交
          </AntButton>
        </footer>
      ) : null}
    </form>
  )
}
