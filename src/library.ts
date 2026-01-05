// import type { Table } from 'dexie'
// import type { LLMConfig } from './types/llmconfig'
import { Manager } from './manager'

// export class Library extends Manager {
//   // #modelTable!: Table<LLMConfig>
//   public get modelTable(): Table<LLMConfig> {
//     // return this.#modelTable
//   }

//   // 初始化并加载providers以及models数据．
//   async init(models: Table<LLMConfig>): Promise<void> {
//     this.#modelTable = models
//     // 开始加载数据．
//     const allModels = await models.toArray()
//     super.reLoad(allModels)
//   }

//   async upsertModel(cfg: LLMConfig): Promise<boolean> {
//     if (!super.upsertWrapper(cfg)) {
//       return false
//     }
//     // 开始更新数据库．
//     const key = await this.#modelTable.put(cfg)
//     return key === cfg.id
//   }

//   async delModel(id: string): Promise<void> {
//     super.delWrapper(id)
//     // 同步至数据库．
//     await this.#modelTable.delete(id)
//   }
// }

export const llmcfgInst = new Manager()
