import type { LLMBility, LLMConfig, LLMProvider } from '../types/llmconfig'
// wrapper-factory.ts
import type { ILLMWrapper } from '../types/llmwrapper'
import { TextWrapper } from './text'

/**
 * 包装器工厂
 */
export class WrapperFactory {
  /**
   * 根据 tag 创建相应的包装器
   */
  static createWrapper(config: LLMConfig, provider: LLMProvider): ILLMWrapper {
    const bility = this.getModelTypeFromTag(config.bility)

    switch (bility) {
      case 'text':
        return new TextWrapper(config, provider)
      case 'image':
        break
    }

    throw new Error(`不支持的模型标签: ${bility}`)

    // // 图像类型
    // if (tag === 'image' || tag === 'image_modify') {
    //     return new ImageLLMWrapper(config);
    // }

    // // 视频类型
    // if (tag === 'video' || tag === 'video_modify') {
    //     return new VideoLLMWrapper(config);
    // }

    // // 音频类型
    // if (tag === 'speech' || tag === 'speech_modify' ||
    //     tag === 'music' || tag === 'music_modify') {
    //     return new AudioLLMWrapper(config);
    // }
  }

  /**
   * 获取标签对应的模型类型
   */
  static getModelTypeFromTag(tag: LLMBility): string {
    if (tag === 'text') {
      return 'text'
    }
    if (tag === 'image' || tag === 'image_modify') {
      return 'image'
    }
    if (tag === 'video' || tag === 'video_modify') {
      return 'video'
    }
    if (tag === 'speech' || tag === 'speech_modify'
      || tag === 'music' || tag === 'music_modify') {
      return 'audio'
    }
    throw new Error(`未知的能力标签: ${tag}`)
  }
}
