// 注册所有 widget（副作用导入）
import { registerWidget } from './registry'

// 输入类
import { TextWidget } from './text'
import { TextareaWidget } from './textarea'
import { NumberWidget } from './number'
import { DateWidget } from './date'
import { DateRangeWidget } from './date-range'
import { SelectWidget } from './select'
import { RadioWidget } from './radio'
import { CheckboxWidget } from './checkbox'
import { UserPickerWidget } from './user-picker'
import { UploadWidget } from './upload'

// 展示类
import { HeadingWidget } from './heading'
import { ParagraphWidget } from './paragraph'
import { DividerWidget } from './divider'
import { ImageWidget } from './image'

// 注册
registerWidget(TextWidget)
registerWidget(TextareaWidget)
registerWidget(NumberWidget)
registerWidget(DateWidget)
registerWidget(DateRangeWidget)
registerWidget(SelectWidget)
registerWidget(RadioWidget)
registerWidget(CheckboxWidget)
registerWidget(UserPickerWidget)
registerWidget(UploadWidget)
registerWidget(HeadingWidget)
registerWidget(ParagraphWidget)
registerWidget(DividerWidget)
registerWidget(ImageWidget)

// 导出 registry API
export { registerWidget, getWidget, getAllWidgets, hasWidget } from './registry'

// 导出各 widget 定义（方便外部按需引用）
export {
  TextWidget,
  TextareaWidget,
  NumberWidget,
  DateWidget,
  DateRangeWidget,
  SelectWidget,
  RadioWidget,
  CheckboxWidget,
  UserPickerWidget,
  UploadWidget,
  HeadingWidget,
  ParagraphWidget,
  DividerWidget,
  ImageWidget,
}
