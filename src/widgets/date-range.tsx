import { DatePicker, Input, Switch, Form } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import type {
  WidgetDefinition,
  WidgetRuntimeProps,
  WidgetDesignProps,
  WidgetConfigProps,
  FieldSchema,
} from '@zdy-oa/utils'
import { BlockOutlined } from '@ant-design/icons'

const RuntimeView: React.FC<WidgetRuntimeProps> = ({ value, onChange, readOnly }) => {
  const rangeValue: [Dayjs, Dayjs] | null =
    Array.isArray(value) && value.length >= 2
      ? [dayjs(String(value[0])), dayjs(String(value[1]))]
      : null
  return (
    <DatePicker.RangePicker
      value={rangeValue}
      disabled={readOnly}
      onChange={(dates) => {
        if (dates && dates[0] && dates[1]) {
          onChange?.([dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')])
        } else {
          onChange?.([])
        }
      }}
      style={{ width: '100%' }}
    />
  )
}

const DesignView: React.FC<WidgetDesignProps> = ({ selected }) => {
  return (
    <DatePicker.RangePicker
      disabled
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
        <Switch checked={!!field.required} onChange={(v: boolean) => update({ required: v })} />
      </Form.Item>
    </Form>
  )
}

export const DateRangeWidget: WidgetDefinition = {
  type: 'date-range',
  label: '日期范围',
  category: 'input',
  icon: <BlockOutlined />,
  RuntimeView,
  DesignView,
  ConfigView,
}
