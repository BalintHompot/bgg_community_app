// These types are generated from BGG API responses
//
export interface GameDetails {
  itemid: number
  objecttype: string
  objectid: number
  label: string
  labelpl: string
  type: string
  id: string
  href: string
  subtype: string
  subtypes: string[]
  versioninfo: VersionInfo
  name: string
  alternatename: null
  yearpublished: string
  minplayers: string
  maxplayers: string
  minplaytime: string
  maxplaytime: string
  minage: string
  override_rankable: number
  targetco_url: string
  shopify_store_url: null
  walmart_id: null
  instructional_videoid: null
  summary_videoid: null
  playthrough_videoid: null
  focus_videoid: null
  howtoplay_videoid: null
  bggstore_product: null
  short_description: string
  links: { [key: string]: Link[] }
  linkcounts: { [key: string]: number }
  secondarynamescount: number
  alternatenamescount: number
  primaryname: PrimaryName
  alternatenames: AlternateName[]
  description: string
  wiki: string
  website: Website
  imageid: string
  images: Images
  imagepagehref: string
  imageurl: string
  topimageurl: string
  imageSets: ImageSets
  itemstate: ItemState
  promoted_ad: null
  special_user: null
}

interface AlternateName {
  nameid: string
  name: string
}

interface ImageSets {
  square100: Mediacard
  mediacard: Mediacard
}

interface Mediacard {
  src: string
  'src@2x': string
}

interface Images {
  thumb: string
  micro: string
  square: string
  squarefit: string
  tallthumb: string
  previewthumb: string
  square200: string
}

enum ItemState {
  Approved = 'approved',
}

interface Link {
  name: string
  objecttype: ObjectType
  objectid: string
  primarylink: number
  itemstate: ItemState
  href: string
}

export enum ObjectType {
  Company = 'company',
  Person = 'person',
  Property = 'property',
  Version = 'version',
}

interface PrimaryName {
  nameid: string
  name: string
  sortindex: string
  primaryname: string
  translit: string
}

interface VersionInfo {
  kickstarter_widget_url: string
  gamepageorderurl: null
  shopifyitem: null
}

interface Website {
  url: boolean | string
}
