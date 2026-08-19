import type { FieldType, WidgetDefinition } from '@zdy-oa/utils'

const widgetRegistry = new Map<FieldType, WidgetDefinition>()

export function registerWidget(def: WidgetDefinition): void {
  widgetRegistry.set(def.type, def)
}

export function getWidget(type: FieldType): WidgetDefinition | undefined {
  return widgetRegistry.get(type)
}

export function getAllWidgets(): WidgetDefinition[] {
  return Array.from(widgetRegistry.values())
}

export function hasWidget(type: FieldType): boolean {
  return widgetRegistry.has(type)
}
