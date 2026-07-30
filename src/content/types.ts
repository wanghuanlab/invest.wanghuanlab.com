export interface Topic {
  slug: string
  name: string
  summary: string
  order: number
}

export interface ArticleMeta {
  topicSlug: string
  slug: string
  title: string
  date: string
  summary: string
  tags?: string[]
}

export interface Article extends ArticleMeta {
  body: string
}
