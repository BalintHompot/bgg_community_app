export interface User {
  type: string
  id: string
  userid: number
  username: string
  href: string
  firstname: string
  lastname: string
  city: string
  state: string
  country: string
  isocountry: string
  regdate: Date
  designerid: number
  publisherid: number
  hideSupporter: boolean
  adminBadges: AdminBadges
  userMicrobadges: any[]
  supportYears: string[]
  hideName: boolean
  links: Link[]
  flag: Flag
  avatar: Avatar
  badgeUrls: BadgeUrls
}

interface AdminBadges {
  boardgame: boolean
  rpg: boolean
  videogame: boolean
}

interface Avatar {
  urls: Urls
  height: number
  width: number
}

interface Urls {
  md: string
  sm: string
  default: string
}

interface BadgeUrls {
  default: string
}

interface Flag {
  src: string
  url: string
}

interface Link {
  rel: string
  uri: string
}
