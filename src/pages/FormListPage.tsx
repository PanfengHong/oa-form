import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { App as AntApp, Button, Space, Table, Upload, Drawer, Form, Input } from 'antd'
import type { TableColumnsType } from 'antd'
import {
  PlusOutlined,
  UploadOutlined,
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import type { FormSchema } from '../types'
import { getFormList, createForm, deleteForm } from '../api'
import { formatDate, type ResponseData } from '@zdy-oa/utils'

function downloadFormJson(form: FormSchema): void {
  const blob = new Blob([JSON.stringify(form, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${form.id || 'form'}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function FormListInner() {
  const { message, modal } = AntApp.useApp()
  const [visible, setVisible] = useState<boolean>(false);
  const [forms, setForms] = useState<FormSchema[]>(() => [])
  const [formName, setFormName] = useState<string>('')
  const [formDescription, setFormDescription] = useState<string>('')

  const refresh = (newForms?: FormSchema[]) => {
    setForms(newForms || [])
  }

  const handleOpen = () => {
    setVisible(true)
  }

  const handleClose = () => {
    setVisible(false)
  }

  const handleSave = () => {
    createForm({
      "name": formName,
      "description": formDescription,
      "schema": {
        fields: []
      }
    }).then((res: ResponseData) => {
      console.log(res);
      setVisible(false);
      refresh([...forms, res.data])
    })
  }

  const handleDelete = (id: string) => {
    console.log(id)
    modal.confirm({
      title: '确认删除该表单？',
      okText: '确认',
      okType: 'danger',
      onOk: () => {
        deleteForm(id).then(() => {
          message.success('已删除')
          refresh(forms.filter((f) => f.id !== id)  )
        })
      },
    })
  }

  const handleImport = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as FormSchema
        if (!parsed.id || !Array.isArray(parsed.layout?.fields) || typeof parsed.name !== 'string') {
          throw new Error('invalid schema')
        }
        refresh()
        message.success('导入成功')
      } catch {
        message.error('JSON 格式不正确')
      }
    }
    reader.readAsText(file)
  }

  const handleFormNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormName(e.target.value)
  }

  const handleFormDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormDescription(e.target.value)
  }

  const columns: TableColumnsType<FormSchema> = [
    { title: '标题', dataIndex: 'name', render: (v: string) => v || '(未命名)' },
    { title: '字段数', width: 90, render: (_, r) => r.layout?.fields?.length || 0 },
    {
      title: '更新时间', dataIndex: 'updatedAt', width: 200, render: (_, r) => {
        return (
          <span>{formatDate(r.updatedAt)}</span>
        )
      }
    },
    {
      title: '操作',
      width: 230,
      render: (_, r) => (
        <Space>
          <Link to={`/designer/${r.id}`} target="_blank">
            <Button
              size="small"
              type="link"
              icon={<EditOutlined />}
            >
              设计
            </Button>
          </Link>
          <Button size="small" type="link" icon={<DownloadOutlined />} onClick={() => downloadFormJson(r)}>
            导出
          </Button>
          <Button size="small" type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(r.id)}>
              删除
            </Button>
        </Space>
      ),
    },
  ]

  useEffect(() => {
    getFormList()
      .then((res: ResponseData) => {
        if (res.code === 200) {
          setForms(res.data || []);
        } else {
          message.error(res.message || '加载表单列表失败');
        }
      })
      .catch((err: ResponseData) => {
        console.error('getFormList error:', err?.code, err?.message, err);
        message.error(err?.message || '加载表单列表失败');
      });
  }, [])

  return (
    <div className="oa-module-page">
      <h2>表单管理</h2>
      <p className="oa-module-page__desc">低代码设计流程表单 · oa-form</p>
      <div className="oa-form__list-toolbar">
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpen}>
            新建表单
          </Button>
          <Upload
            accept=".json,application/json"
            showUploadList={false}
            beforeUpload={(file) => {
              handleImport(file)
              return false
            }}
          >
            <Button icon={<UploadOutlined />}>导入 JSON</Button>
          </Upload>
        </Space>
      </div>
      <Table
        rowKey="id"
        dataSource={forms}
        columns={columns}
        pagination={false}
        locale={{ emptyText: '暂无表单，点击「新建表单」开始设计' }}
      />
      <Drawer
        title="新建表单"
        placement="right"
        closable={{ placement: 'end' }}
        width="min(820px, 90vw)"
        open={visible}
        extra={
          <Space>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave} type="primary">
              Submit
            </Button>
          </Space>
        }
        onClose={() => setVisible(false)}
        destroyOnHidden
      >
        {visible && (
          <div>
            <Form layout="vertical" requiredMark={false}>
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter form name' }]}
              >
                <Input placeholder="Please enter form name" value={formName} onChange={handleFormNameChange} />
              </Form.Item>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  {
                    required: true,
                    message: 'please enter form description',
                  },
                ]}
              >
                <Input.TextArea rows={4} placeholder="please enter form description" value={formDescription} onChange={handleFormDescriptionChange} />
              </Form.Item>
            </Form>
          </div>
        )}
      </Drawer>
    </div>
  )
}

export function FormListPage() {
  return (
    <AntApp>
      <FormListInner />
    </AntApp>
  )
}