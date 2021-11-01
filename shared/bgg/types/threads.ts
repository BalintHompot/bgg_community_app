export interface ThreadList {
  data: Thread[]
  operations: Operation[]
  pagination?: Pagination
  totalCount?: number
}

interface AssocItem {
  type: string
  id: string
  name: string
  href: string
  label: string
  labelpl: string | null
  hasAngularLink: boolean
  descriptors?: Descriptor[]
  imageSets?: ImageSets
  associtem?: AssocItem
}

export type ForumItem = AssocItem

export interface Thread extends AssocItem {
  type: 'threads'
  pinned: boolean
  locked: boolean
  moved: boolean
  creator: User
  parent: ForumItem
  reactions: Reactions
  numthumbs: number
  numreplies: number
  postdate: Date
  lastPost: LastPost
}

interface User extends AssocItem {
  type: 'users'
  username: string
}

interface Descriptor {
  name: string
  displayValue: string
}

export interface ImageSets {
  square100?: {
    src: string
  }
  square?: {
    src: string
    'src@2x'?: string
  }
}

interface LastPost {
  href: string
  postdate: Date
  author: User
}

export interface Reactions {
  thumbs: number
}

interface Operation {
  key: string
  label: string
  options: Option[]
  default: string
}

interface Option {
  label: string
  value: string
}

interface Pagination {
  perPage: number
  pageid: number
  total: number
}
