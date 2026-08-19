/**
 * oa-form 的 mock 数据与规则注册
 *
 * 在统一开关启用时（VITE_USE_MOCK=true），这些规则会被 request 拦截，
 * 直接返回 ResponseData，不再调用真实接口。
 *
 * 命中的接口：
 *   GET    /api/form/list           表单列表
 *   GET    /api/form/detail/:id     表单详情
 *   POST   /api/form/create         新建表单
 *   PATCH  /api/form/update/:id     更新表单
 *   DELETE /api/form/delete/:id     删除表单
 */
import type { MockContext } from '@zdy-oa/utils'
import { registerMocks } from '@zdy-oa/utils'
import type { ResponseData } from '@zdy-oa/utils'
import type { FormSchema } from './types'
import { sampleLeaveFormSchema } from './samples'

const STORAGE_KEY = 'oa_mock_forms'

function ok<T>(data: T, message = ''): ResponseData<T> {
  return { code: 200, data, message }
}

function fail(message: string, code = 500): ResponseData<null> {
  return { code, data: null, message }
}

function loadForms(): FormSchema[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      // 首次初始化：植入一个请假表单示例
      const seed = [sampleLeaveFormSchema]
      saveForms(seed)
      return seed
    }
    return JSON.parse(raw) as FormSchema[]
  } catch {
    return []
  }
}

function saveForms(forms: FormSchema[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(forms))
}

function genId(): string {
  return `form_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`
}

export function registerFormMocks(): void {
  registerMocks([
    // 列表
    {
      method: 'GET',
      pattern: '/api/form/list',
      handler: () => {
        const forms = loadForms()
        return ok(forms)
      },
    },
    // 详情
    {
      method: 'GET',
      pattern: '/api/form/detail/:id',
      handler: (ctx: MockContext) => {
        const forms = loadForms()
        const found = forms.find((f) => f.id === ctx.params.id)
        if (!found) return fail('表单不存在', 404)
        return ok(found)
      },
    },
    // 新建
    {
      method: 'POST',
      pattern: '/api/form/create',
      handler: (ctx: MockContext) => {
        const forms = loadForms()
        const body = ctx.body || {}
        const now = Date.now().toString()
        const form: FormSchema = {
          id: genId(),
          name: body.name || '未命名表单',
          layout: {
            id: `layout_${now}`,
            name: body.name || '未命名表单',
            type: 'flow',
            fields: body?.schema?.fields || [],
          },
          createdAt: now,
          updatedAt: now,
        }
        forms.push(form)
        saveForms(forms)
        return ok(form, '创建成功')
      },
    },
    // 更新
    {
      method: 'PATCH',
      pattern: '/api/form/update/:id',
      handler: (ctx: MockContext) => {
        const forms = loadForms()
        const idx = forms.findIndex((f) => f.id === ctx.params.id)
        if (idx < 0) return fail('表单不存在', 404)
        const body = ctx.body || {}
        const updated: FormSchema = {
          ...forms[idx],
          ...(body.name ? { name: body.name } : {}),
          ...(body.layout ? { layout: body.layout } : {}),
          ...(body.schema?.fields ? { layout: { ...forms[idx].layout, fields: body.schema.fields } } : {}),
          updatedAt: Date.now().toString(),
        }
        forms[idx] = updated
        saveForms(forms)
        return ok(updated, '更新成功')
      },
    },
    // 删除
    {
      method: 'DELETE',
      pattern: '/api/form/delete/:id',
      handler: (ctx: MockContext) => {
        const forms = loadForms()
        const filtered = forms.filter((f) => f.id !== ctx.params.id)
        saveForms(filtered)
        return ok(null, '删除成功')
      },
    },
  ])
}
