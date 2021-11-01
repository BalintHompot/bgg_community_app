export interface ForumList {
  uforums: Forum[]
}

export interface Forum {
  type: 'uforums'
  id: string
  name: string
  description: string
  parentForumuid: string
  postingPermitted: boolean
  href: string
  hasAngularLink: boolean
  source: Source
  sourceForumsLink: SourceForumsLink
  ancestorForums: SourceForumsLink[]
}

export interface SourceForumsLink {
  href: string
  name: string
  hasAngularLink: boolean
}

export interface Source {
  type: string
  id: string
}
