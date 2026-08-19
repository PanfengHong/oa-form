import { Image, Empty, Input, Form } from 'antd'
import type {
  WidgetDefinition,
  WidgetRuntimeProps,
  WidgetDesignProps,
  WidgetConfigProps,
  FieldSchema,
} from '@zdy-oa/utils'
import { PictureOutlined } from '@ant-design/icons'

const RuntimeView: React.FC<WidgetRuntimeProps> = ({ field }) => {
  if (field.content) {
    return <Image src={field.content} width={200} />
  }
  return <Empty description="暂无图片" />
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
      <Form.Item label="图片地址">
        <Input
          placeholder="https://..."
          value={field.content ?? ''}
          onChange={(e) => update({ content: e.target.value })}
        />
      </Form.Item>
    </Form>
  )
}

export const ImageWidget: WidgetDefinition = {
  type: 'image',
  label: '图片',
  category: 'display',
  icon: <PictureOutlined />,
  RuntimeView,
  DesignView,
  ConfigView,
}
