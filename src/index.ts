// 类型契约（从 designer re-export）
export type {
  FieldSchema,
  FieldType,
  FieldOption,
  FormSchema,
  FormValues,
  LayoutSchema,
  LayoutType,
  WidgetDefinition,
  WidgetRuntimeProps,
  WidgetDesignProps,
  WidgetConfigProps,
} from './types'

// FormRenderer
export { FormRenderer } from './FormRenderer'
export type { FormRendererProps } from './FormRenderer'

// Widget 组件库（导入即触发注册）
export {
  registerWidget,
  getWidget,
  getAllWidgets,
  hasWidget,
} from './widgets'

// 示例
export { sampleLeaveFormSchema } from './samples'

// 页面
export { FormListPage } from './pages/FormListPage'
