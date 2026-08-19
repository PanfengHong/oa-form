import { Typography, Input, Form } from 'antd'
import { FontSizeOutlined } from '@ant-design/icons'
import type {
  WidgetDefinition,
  WidgetRuntimeProps,
  WidgetDesignProps,
  WidgetConfigProps,
  FieldSchema,
} from '@zdy-oa/utils'

const RuntimeView: React.FC<WidgetRuntimeProps> = ({ field }) => {
  return <Typography.Title level={3}>{field.content || field.label}</Typography.Title>
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
      <Form.Item label="标题文本">
        <Input
          value={field.content ?? ''}
          onChange={(e) => update({ content: e.target.value })}
        />
      </Form.Item>
    </Form>
  )
}

export const HeadingWidget: WidgetDefinition = {
  type: 'heading',
  label: '标题',
  category: 'display',
  icon: <FontSizeOutlined />,
  RuntimeView,
  DesignView,
  ConfigView,
}
