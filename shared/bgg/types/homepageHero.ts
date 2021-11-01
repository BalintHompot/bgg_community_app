import { User } from './user'

export interface HeroItem {
  title: string
  name: string
  href: string
  hasAngularLink: boolean
  promoted: boolean
  images: Images
  author: string
  resolvedAuthor: User
  aggregateSource: AggregateSource | false
}

interface AggregateSource {
  type: string
  id: string
}

interface Images {
  herosquare: ImageDetails
  hero: ImageDetails
}

interface ImageDetails {
  width: string
  height: string
  'src@2x': string
  src: string
}
