import type { FormSchema } from './types'

export const sampleLeaveFormSchema: FormSchema = {
  id: 'leave-request',
  title: '请假申请',
  fields: [
    { id: 'reason', type: 'textarea', label: '请假事由', required: true },
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
    { id: 'start', type: 'date', label: '开始日期', required: true },
    { id: 'end', type: 'date', label: '结束日期', required: true },
    { id: 'days', type: 'number', label: '天数', required: true },
  ],
}
