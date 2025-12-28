import type { Table } from 'dexie'
import type { LLMConfig, LLMProvider } from './types/llmconfig'
import { Manager } from './manager'

export class Library extends Manager {
  #modelTable!: Table<LLMConfig>
  #providerTable!: Table<LLMProvider>
  public get modelTable(): Table<LLMConfig> {
    return this.#modelTable
  }

  public get providerTable(): Table<LLMProvider> {
    return this.#providerTable
  }

  // 初始化并加载providers以及models数据．
  async init(models: Table<LLMConfig>, providers: Table<LLMProvider>): Promise<void> {
    this.#modelTable = models
    this.#providerTable = providers
    // 开始加载数据．
    const allModels = await models.toArray()
    const allProviders = await providers.toArray()
    super.reLoad(allModels, allProviders)
  }

  async upsertModel(cfg: LLMConfig): Promise<boolean> {
    if (!super.upsertWrapper(cfg)) {
      return false
    }
    // 开始更新数据库．
    const key = await this.#modelTable.put(cfg)
    return key === cfg.id
  }

  async delModel(id: string): Promise<void> {
    super.delWrapper(id)
    // 同步至数据库．
    await this.#modelTable.delete(id)
  }

  async upsertProvider(provider: LLMProvider): Promise<boolean> {
    const idx = super.providers.findIndex(p => p.id === provider.id)
    await this.#providerTable.put(provider)
    if (idx >= 0) {
      // 已有provider,需要更新全部对应的models.
      super.providers[idx] = { ...provider }
      const affectModels = super.configs.filter(cfg => cfg.pid === provider.id)
      affectModels.forEach((model) => {
        super.upsertWrapper(model)
      })
    }
    else {
      super.providers.push({ ...provider })
    }
    return true
  }

  async delProvider(pid: string): Promise<void> {
    const idx = super.providers.findIndex(p => p.id === pid)
    if (idx !== -1) {
      await this.#providerTable.delete(pid)
      super.providers.splice(idx, 1)
      const affectModels = super.configs.filter(cfg => cfg.pid === pid)
      if (affectModels.length > 0) {
        const ids = affectModels.map((model) => {
          super.delWrapper(model.id)
          return model.id
        })
        await this.#modelTable.bulkDelete(ids)
      }
    }
  }
}

export const llmcfgInst = new Library()
