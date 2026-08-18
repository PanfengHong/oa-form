import type { FormSchema } from './types'

export const sampleLeaveFormSchema: FormSchema = {
  id: 'leave-request',
  name: '请假申请',
  layout: {
    id: 'layout-leave-request',
    name: '请假申请',
    type: 'flow',
    fields: [
      { id: 'h1',     type: 'heading',   label: '标题',  content: '请假申请' },
      { id: 'p1',     type: 'paragraph', label: '说明',  content: '请如实填写请假信息，提交后进入审批流程。' },
      { id: 'reason', type: 'textarea',  label: '请假事由', required: true },
      {
        id: 'type',
        type: 'select',
        label: '请假类型',
        required: true,
        options: [
          { label: '年假', value: 'annual' },
          { label: '事假', value: 'personal' },
          { label: '病假', value: 'sick' },
        ],
      },
      { id: 'start', type: 'date',   label: '开始日期', required: true },
      { id: 'end',   type: 'date',   label: '结束日期', required: true },
      { id: 'days',  type: 'number', label: '天数',     required: true },
    ],
  },
  createdAt: Date.now().toString(),
  updatedAt: Date.now().toString(),
}
