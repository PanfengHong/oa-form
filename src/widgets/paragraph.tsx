import { Typography, Input, Form } from 'antd'
import type {
  WidgetDefinition,
  WidgetRuntimeProps,
  WidgetDesignProps,
  WidgetConfigProps,
  FieldSchema,
} from '@zdy-oa/designer'
import { AlignLeftOutlined } from '@ant-design/icons'

const RuntimeView: React.FC<WidgetRuntimeProps> = ({ field }) => {
  return <Typography.Paragraph>{field.content}</Typography.Paragraph>
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
      <Form.Item label="段落文本">
        <Input.TextArea
          rows={4}
          value={field.content ?? ''}
          onChange={(e) => update({ content: e.target.value })}
        />
      </Form.Item>
    </Form>
  )
}

export const ParagraphWidget: WidgetDefinition = {
  type: 'paragraph',
  label: '段落',
  category: 'display',
  icon: <AlignLeftOutlined />,
  RuntimeView,
  DesignView,
  ConfigView,
}
