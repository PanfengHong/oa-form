import { Checkbox, Input, Switch, Form, Button, Flex } from 'antd'
import { PlusOutlined, DeleteOutlined, CheckSquareOutlined } from '@ant-design/icons'
import type {
  WidgetDefinition,
  WidgetRuntimeProps,
  WidgetDesignProps,
  WidgetConfigProps,
  FieldSchema,
} from '@zdy-oa/utils'

const RuntimeView: React.FC<WidgetRuntimeProps> = ({ field, value, onChange, readOnly }) => {
  return (
    <Checkbox.Group
      value={value as (string | number)[] | undefined}
      options={field.options ?? []}
      disabled={readOnly}
      onChange={(checkedValues) => onChange?.(checkedValues as (string | number)[])}
    />
  )
}

const DesignView: React.FC<WidgetDesignProps> = ({ field, selected }) => {
  return (
    <Checkbox.Group
      disabled
      options={field.options ?? []}
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
      <Form.Item label="必填">
        <Switch checked={!!field.required} onChange={(v: boolean) => update({ required: v })} />
      </Form.Item>
      <Form.Item label="选项">
        <Flex vertical gap={8}>
          {(field.options ?? []).map((opt, i) => (
            <Flex key={i} gap={8} align="center">
              <Input
                placeholder="显示名"
                value={opt.label}
                style={{ flex: 1 }}
                onChange={(e) => {
                  const options = [...(field.options ?? [])]
                  options[i] = { ...options[i], label: e.target.value }
                  update({ options })
                }}
              />
              <Input
                placeholder="值"
                value={opt.value}
                style={{ flex: 1 }}
                onChange={(e) => {
                  const options = [...(field.options ?? [])]
                  options[i] = { ...options[i], value: e.target.value }
                  update({ options })
                }}
              />
              <Button
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  const options = [...(field.options ?? [])]
                  options.splice(i, 1)
                  update({ options })
                }}
              />
            </Flex>
          ))}
          <Button
            block
            size="small"
            type="dashed"
            icon={<PlusOutlined />}
            onClick={() =>
              update({ options: [...(field.options ?? []), { label: '', value: '' }] })
            }
          >
            添加选项
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  )
}

export const CheckboxWidget: WidgetDefinition = {
  type: 'checkbox',
  label: '多选复选',
  category: 'input',
  icon: <CheckSquareOutlined />,
  RuntimeView,
  DesignView,
  ConfigView,
}
