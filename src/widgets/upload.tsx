import { Upload, Button, Input, Switch, Form } from 'antd'
import type { UploadFile, UploadProps } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type {
  WidgetDefinition,
  WidgetRuntimeProps,
  WidgetDesignProps,
  WidgetConfigProps,
  FieldSchema,
} from '@zdy-oa/utils'

const RuntimeView: React.FC<WidgetRuntimeProps> = ({ value, onChange, readOnly }) => {
  const fileList = (Array.isArray(value)
    ? value.map((name, idx) => ({
        uid: `${idx}`,
        name: String(name),
        status: 'done',
      }))
    : []) as UploadFile[]

  const handleChange: UploadProps['onChange'] = (info) => {
    onChange?.(info.fileList.map((f) => f.name ?? ''))
  }

  return (
    <Upload
      fileList={fileList}
      beforeUpload={() => false}
      onChange={handleChange}
      disabled={readOnly}
    >
      <Button icon={<UploadOutlined />} disabled={readOnly}>
        点击上传
      </Button>
    </Upload>
  )
}

const DesignView: React.FC<WidgetDesignProps> = ({ field, selected }) => {
  return (
    <Upload disabled beforeUpload={() => false} showUploadList={false}>
      <Button
        icon={<UploadOutlined />}
        disabled
        style={selected ? { outline: '2px solid #1677ff', outlineOffset: -2 } : undefined}
      >
        {field.label || '点击上传'}
      </Button>
    </Upload>
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

export const UploadWidget: WidgetDefinition = {
  type: 'upload',
  label: '文件上传',
  category: 'input',
  icon: <UploadOutlined />,
  RuntimeView,
  DesignView,
  ConfigView,
}
