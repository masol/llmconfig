import type { ModelMessage } from 'ai'
import type z from 'zod'
import type { LLMBility, LLMConfig } from './types/llmconfig'
import type { CallResult, GenerateObjectOptions, GenerateObjectResult, ILLMWrapper, JSONCallResult } from './types/llmwrapper'
import { isTextLLMWrapper } from './utils/guard'
import { WrapperFactory } from './wrapper'

const CallError: CallResult = {
  success: false,
  error: new Error('Not Found or All Error'),
} as const

export type WrapperPredicate = (wrapper: ILLMWrapper) => boolean

export class Manager {
  #wrappers: Map<string, ILLMWrapper> = new Map()
  get configs(): LLMConfig[] {
    return Array.from(this.#wrappers.values()).map(wrapper => wrapper.getConfig())
  }

  get wrappers(): ILLMWrapper[] {
    return Array.from(this.#wrappers.values())
  }

  getWrapper(id: string): ILLMWrapper | undefined {
    return this.#wrappers.get(id)
  }

  filterWrapper(pred: WrapperPredicate): ILLMWrapper[] {
    return Array.from(this.#wrappers.values())
      .filter(pred)
  }

  findWrapper(pred: WrapperPredicate): ILLMWrapper | undefined {
    return Array.from(this.#wrappers.values())
      .find(pred)
  }

  reLoad(models: LLMConfig[]): void {
    this.#wrappers.clear()
    models.forEach((model) => {
      this.upsertWrapper(model)
    })
  }

  upsertWrapper(cfg: LLMConfig): boolean {
    if (this.#wrappers.has(cfg.id)) {
      this.#wrappers.delete(cfg.id)
    }

    // 未启用，返回true--但是尚未加入．以允许后续同步数据库．
    if (!cfg.enabled) {
      return true
    }

    const wrapper = WrapperFactory.createWrapper(cfg)
    this.#wrappers.set(cfg.id, wrapper)
    return true
  }

  // 有可能由于enable为false, 未加入模型．
  delWrapper(id: string): void {
    if (this.#wrappers.has(id)) {
      this.#wrappers.delete(id)
    }
  }

  private getMatchingWrapper(bility: LLMBility): ILLMWrapper[] {
    return Array.from(this.#wrappers.values())
      .filter((value) => {
        const cfg = value.getConfig()
        return cfg.enabled && cfg.bility === bility
      })
      .sort((a, b) => a.callCount - b.callCount) // 最少调用的优先
  }

  // 对LLMBility调用call.直到第一个调用成功．
  async call(bility: LLMBility, input: string | ModelMessage[]): Promise<CallResult> {
    const matchingWrappers = this.getMatchingWrapper(bility)
    for (const wrapper of matchingWrappers) {
      const result = await wrapper.call(input)
      if (result.success) {
        return result
      }
    }

    return CallError
  }

  // 对LLMBility调用call.直到第一个调用成功．
  async callJSON(input: string | ModelMessage[], maxRetries: number = 3): Promise<JSONCallResult> {
    const matchingWrappers = this.getMatchingWrapper('text')
    for (const wrapper of matchingWrappers) {
      if (isTextLLMWrapper(wrapper)) {
        const result = await wrapper.callJSON(input, maxRetries)
        if (result.success) {
          return result
        }
      }
    }
    return CallError
  }

  // 对LLMBility调用call.直到第一个调用成功．
  async generateObject<T extends z.ZodType>(input: string | ModelMessage[], schema: T, options?: GenerateObjectOptions): Promise<GenerateObjectResult<z.infer<T>>> {
    const matchingWrappers = this.getMatchingWrapper('text')
    for (const wrapper of matchingWrappers) {
      if (isTextLLMWrapper(wrapper)) {
        const result = await wrapper.generateObject(input, schema, options)
        if (result.success) {
          return result
        }
      }
    }
    return CallError
  }
}
