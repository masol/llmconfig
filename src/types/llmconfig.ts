import type { LLMBilities } from '../utils/const'

export type LLMBility = typeof LLMBilities[number]

export interface LLMProvider {
  id: string
  name: string
  apiKey: string
  createdAt: number
  baseUrl?: string
}

/**
 * LLM配置接口
 */
export interface LLMConfig {
  id: string
  pid: string // provider Id.
  model: string // 模型名称.
  bility: LLMBility
  createdAt: number
  // weight: number; // 暂未启用。防止干扰试听。
  enabled?: boolean
  temperature?: number
  maxTokens?: number
  // [key: string]: unknown
}
