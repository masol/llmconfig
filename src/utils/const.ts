// import {type Dexie} from 'dexie'

export const TableSchema = {
  provider: 'id,name,createdAt',
  llms: 'id,pid,model,bility,createdAt',
} as const

export const LLMBilities = [
  'text',
  'image',
  'image_modify',
  'video',
  'video_modify',
  'speech',
  'speech_modify',
  'music',
  'music_modify',
] as const
