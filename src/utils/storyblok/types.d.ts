export type StoryblokLink = {
  id: number
  slug: string
  name: string
  path: string | null
  is_folder: boolean
  parent_id: number
  published: boolean
  position: number
  uuid: string
  is_startpage: boolean
  real_path: string
  alternates: [
    {
      path: string
      name: string | null
      lang: string
      published: boolean | null
      translated_slug: string
    },
  ]
}
