import type { ILLMWrapper, ITextLLMWrapper } from '../types/llmwrapper'

/**
 * 类型守卫：判断是否为 ITextLLMWrapper
 * @param wrapper LLMWrapper 实例
 * @returns 是否支持结构化输出
 */
export function isTextLLMWrapper(wrapper: ILLMWrapper): wrapper is ITextLLMWrapper {
  return (
    'callJSON' in wrapper
    && typeof (wrapper as ITextLLMWrapper).callJSON === 'function'
    && 'generateObject' in wrapper
    && typeof (wrapper as ITextLLMWrapper).generateObject === 'function'
  )
}
