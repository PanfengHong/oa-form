// 布局相关类型由 oa-designer 维护，form 通过 `import type` 引用
// 编译后类型引用会被擦除，运行时 form 不依赖 designer
import type { LayoutSchema } from '@zdy-oa/utils'

// 重新导出，方便业务侧从 oa-form 统一引用
export type {
  FieldSchema,
  FieldType,
  FieldOption,
  LayoutSchema,
  LayoutType,
  WidgetDefinition,
  WidgetRuntimeProps,
  WidgetDesignProps,
  WidgetConfigProps,
} from '@zdy-oa/utils'

/**
 * 表单 Schema
 * 表单本体信息，layout 字段嵌入 designer 的设计产物
 */
export interface FormSchema {
  id: string
  name: string
  layout: LayoutSchema
  createdAt: string
  updatedAt: string
}

export type FormValues = Record<string, string | number | (string | number)[] | undefined>
