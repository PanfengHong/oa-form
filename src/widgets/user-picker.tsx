import { Select, Input, Switch, Form } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import type {
  WidgetDefinition,
  WidgetRuntimeProps,
  WidgetDesignProps,
  WidgetConfigProps,
  FieldSchema,
} from '@zdy-oa/designer'

const RuntimeView: React.FC<WidgetRuntimeProps> = ({ field, value, onChange, readOnly }) => {
  return (
    <Select
      mode="multiple"
      value={value as (string | number)[] | undefined}
      options={field.options ?? []}
      placeholder={field.placeholder}
      disabled={readOnly}
      onChange={(v) => onChange?.(v as (string | number)[])}
      suffixIcon={<UserOutlined />}
      style={{ width: '100%' }}
    />
  )
}

const DesignView: React.FC<WidgetDesignProps> = ({ field, selected }) => {
  return (
    <Select
      mode="multiple"
      disabled
      options={field.options ?? []}
      placeholder={field.placeholder || field.label}
      suffixIcon={<UserOutlined />}
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

export const UserPickerWidget: WidgetDefinition = {
  type: 'user-picker',
  label: '人员选择',
  category: 'input',
  icon: <UserOutlined />,
  RuntimeView,
  DesignView,
  ConfigView,
}
