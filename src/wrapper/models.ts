import type { LLMBility } from '../types/llmconfig'

const ImageIdentify = ['-image-']
const SpeechIdentify = ['-tts-']

export function getModelBility(modelName: string): LLMBility {
  if (ImageIdentify.find(id => modelName.includes(id))) {
    if (modelName.includes('-edit-')) {
      return 'image_modify'
    }
    return 'image'
  }

  if (SpeechIdentify.find(id => modelName.includes(id))) {
    return 'speech'
  }

  return 'text'
}
