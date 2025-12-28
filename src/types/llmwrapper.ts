import type { LanguageModelUsage, ModelMessage } from 'ai'
import type { z } from 'zod'
import type { LLMConfig } from './llmconfig'

/**
 * 基础调用结果接口
 */
export interface CallResult {
  success: boolean
  response?: string
  error?: Error
  usage?: LanguageModelUsage
  responseTime?: number
}

/**
 * JSON调用结果接口
 */
export interface JSONCallResult extends CallResult {
  json?: unknown
}

/**
 * 生成对象结果接口
 */
export interface GenerateObjectResult<T> extends CallResult {
  object?: T
  finishReason?: string
}

/**
 * 生成对象选项
 */
export interface GenerateObjectOptions {
  mode?: 'auto' | 'json' | 'tool'
  schemaName?: string
  schemaDescription?: string
}

/**
 * 基础 LLMWrapper 接口
 */
export interface ILLMWrapper {
  // 用于跟踪manager的负载均衡．无论成功失败，只要调用就会增加计数．实现时，可能会乘以系数(weight)
  readonly callCount: number

  /**
   * 调用 LLM
   * @param input 输入内容（字符串、数字或消息数组）
   * @returns 调用结果
   */
  call: (input: string | ModelMessage[]) => Promise<CallResult>

  /**
   * 流式调用 LLM
   * @param input 输入内容
   * @param onChunk 数据块回调函数
   * @returns 调用结果
   */
  callStream: (
    input: string | ModelMessage[],
    onChunk: (chunk: string) => void,
  ) => Promise<CallResult>

  /**
   * 获取配置信息
   * @returns LLM配置
   */
  getConfig: () => LLMConfig
}

/**
 * 支持结构化输出的 LLMWrapper 接口
 */
export interface ITextLLMWrapper extends ILLMWrapper {
  /**
   * 调用 LLM 并返回 JSON（基于文本解析）
   * @param input 输入内容
   * @param maxRetries 最大重试次数，默认2次
   * @returns JSON调用结果
   */
  callJSON: (
    input: string | ModelMessage[],
    maxRetries?: number,
  ) => Promise<JSONCallResult>

  /**
   * 使用 schema 生成结构化对象（推荐使用）
   * @param input 输入内容
   * @param schema Zod schema
   * @param options 生成选项
   * @returns 生成对象结果
   */
  generateObject: <T extends z.ZodType>(
    input: string | ModelMessage[],
    schema: T,
    options?: GenerateObjectOptions,
  ) => Promise<GenerateObjectResult<z.infer<T>>>
}
