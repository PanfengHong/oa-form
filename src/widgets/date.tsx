import { DatePicker, Input, Switch, Form } from 'antd'
import { CalendarOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import type {
  WidgetDefinition,
  WidgetRuntimeProps,
  WidgetDesignProps,
  WidgetConfigProps,
  FieldSchema,
} from '@zdy-oa/designer'

const RuntimeView: React.FC<WidgetRuntimeProps> = ({ field, value, onChange, readOnly }) => {
  return (
    <DatePicker
      value={value ? dayjs(String(value)) : null}
      placeholder={field.placeholder}
      disabled={readOnly}
      onChange={(date) => onChange?.(date ? date.format('YYYY-MM-DD') : '')}
      style={{ width: '100%' }}
    />
  )
}

const DesignView: React.FC<WidgetDesignProps> = ({ field, selected }) => {
  return (
    <DatePicker
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
      <Form.Item label="必填">
        <Switch checked={!!field.required} onChange={(v) => update({ required: v })} />
      </Form.Item>
    </Form>
  )
}

export const DateWidget: WidgetDefinition = {
  type: 'date',
  label: '日期',
  category: 'input',
  icon: <CalendarOutlined />,
  RuntimeView,
  DesignView,
  ConfigView,
}
