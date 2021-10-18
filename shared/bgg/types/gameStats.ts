// These types are generated from BGG API responses
//
export interface GameStats {
  item: {
    rankinfo: RankInfo[]
    polls: Polls
    stats: Stats
    relatedcounts: RelatedCounts
  }
}

interface Polls {
  userplayers: UserPlayers
  playerage: string
  languagedependence: string
  subdomain: string
  boardgameweight: BoardGameWeight
}

interface BoardGameWeight {
  averageweight: number
  votes: number
}

interface UserPlayers {
  best: any[]
  recommended: any[]
  totalvotes: number
}

interface RankInfo {
  prettyname: string
  shortprettyname: string
  veryshortprettyname: string
  subdomain: null
  rankobjecttype: string
  rankobjectid: number
  rank: string
  baverage: string
}

interface RelatedCounts {
  news: number
  blogs: number
  weblink: number
  podcast: number
}

interface Stats {
  usersrated: string
  average: string
  baverage: string
  stddev: string
  avgweight: string
  numweights: string
  numgeeklists: string
  numtrading: string
  numwanting: string
  numwish: string
  numowned: string
  numprevowned: string
  numcomments: string
  numwishlistcomments: string
  numhasparts: string
  numwantparts: string
  views: string
  playmonth: string
  numplays: number
  numplays_month: number
  numfans: number
}
