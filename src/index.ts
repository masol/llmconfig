import { llmcfgInst } from './library'

export { llmcfgInst }
export type { LLMBility, LLMConfig } from './types/llmconfig'
export type { CallResult, GenerateObjectOptions, GenerateObjectResult, ILLMWrapper, ITextLLMWrapper, JSONCallResult } from './types/llmwrapper'
export { LLMBilities, TableSchema } from './utils/const'
export { listModels } from './wrapper/providers'

export default llmcfgInst
