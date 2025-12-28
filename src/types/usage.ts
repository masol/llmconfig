export interface LLMUsage {
  id: string // 这是LLMConfig id.
  provider: string
  input: number | undefined
  output: number | undefined
  total: number | undefined
  cost: number | undefined
  createdAt: number
}
