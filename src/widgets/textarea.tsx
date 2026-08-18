import { Input, Switch, Form } from 'antd'
import { FileTextOutlined } from '@ant-design/icons'
import type {
  WidgetDefinition,
  WidgetRuntimeProps,
  WidgetDesignProps,
  WidgetConfigProps,
  FieldSchema,
} from '@zdy-oa/designer'

const RuntimeView: React.FC<WidgetRuntimeProps> = ({ field, value, onChange, readOnly }) => {
  return (
    <Input.TextArea
      rows={3}
      value={value as string | undefined}
      placeholder={field.placeholder}
      disabled={readOnly}
      onChange={(e) => onChange?.(e.target.value)}
    />
  )
}

const DesignView: React.FC<WidgetDesignProps> = ({ field, selected }) => {
  return (
    <Input.TextArea
      rows={3}
      disabled
      placeholder={field.placeholder || field.label}
      style={selected ? { outline: '2px solid #1677ff', outlineOffset: -2 } : undefined}
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

export const TextareaWidget: WidgetDefinition = {
  type: 'textarea',
  label: '多行文本',
  category: 'input',
  icon: <FileTextOutlined />,
  RuntimeView,
  DesignView,
  ConfigView,
}
