import { Divider, Input, Form } from 'antd'
import type {
  WidgetDefinition,
  WidgetRuntimeProps,
  WidgetDesignProps,
  WidgetConfigProps,
  FieldSchema,
} from '@zdy-oa/designer'
import { MinusOutlined } from '@ant-design/icons'

const RuntimeView: React.FC<WidgetRuntimeProps> = ({ field }) => {
  return <Divider>{field.label}</Divider>
}

const DesignView: React.FC<WidgetDesignProps> = ({ field, selected }) => {
  return (
    <div style={selected ? { outline: '2px solid #1677ff', outlineOffset: -2 } : undefined}>
      <RuntimeView field={field} />
    </div>
  )
}

const ConfigView: React.FC<WidgetConfigProps> = ({ field, onChange }) => {
  const update = (patch: Partial<FieldSchema>) => onChange(patch)
  return (
    <Form layout="vertical">
      <Form.Item label="标签">
        <Input value={field.label} onChange={(e) => update({ label: e.target.value })} />
      </Form.Item>
    </Form>
  )
}

export const DividerWidget: WidgetDefinition = {
  type: 'divider',
  label: '分隔线',
  category: 'display',
  icon: <MinusOutlined />,
  RuntimeView,
  DesignView,
  ConfigView,
}
