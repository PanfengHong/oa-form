import { Input, InputNumber, Switch, Form } from 'antd'
import { NumberOutlined } from '@ant-design/icons'
import type {
  WidgetDefinition,
  WidgetRuntimeProps,
  WidgetDesignProps,
  WidgetConfigProps,
  FieldSchema,
} from '@zdy-oa/designer'

const RuntimeView: React.FC<WidgetRuntimeProps> = ({ field, value, onChange, readOnly }) => {
  return (
    <InputNumber
      value={value as number | undefined}
      placeholder={field.placeholder}
      disabled={readOnly}
      onChange={(v) => onChange?.(v ?? '')}
      style={{ width: '100%' }}
    />
  )
}

const DesignView: React.FC<WidgetDesignProps> = ({ field, selected }) => {
  return (
    <InputNumber
      disabled
      placeholder={field.placeholder || field.label}
      style={{
        width: '100%',
        ...(selected ? { outline: '2px solid #1677ff', outlineOffset: -2 } : {}),
      }}
    />
  )
}

const ConfigView: React.FC<WidgetConfigProps> = ({ field, onChange }) => {
  const update = (patch: Partial<FieldSchema>) => onChange(patch)
  return (
    <Form layout="vertical">
      <Form.Item label="标签">
        <Input value={field.label} onChange={(e) => update({ label: e.target.value })} />
      </Form.Item>
      <Form.Item label="占位提示">
        <Input
          value={field.placeholder ?? ''}
          onChange={(e) => update({ placeholder: e.target.value })}
        />
      </Form.Item>
      <Form.Item label="必填">
        <Switch checked={!!field.required} onChange={(v) => update({ required: v })} />
      </Form.Item>
    </Form>
  )
}

export const NumberWidget: WidgetDefinition = {
  type: 'number',
  label: '数字',
  category: 'input',
  icon: <NumberOutlined />,
  RuntimeView,
  DesignView,
  ConfigView,
}
