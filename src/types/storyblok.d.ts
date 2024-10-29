import {StoryblokStory} from 'storyblok-generate-ts'

export interface GalleryStoryblok {
  slides?: GallerySlideStoryblok[];
  _uid: string;
  component: "Gallery";
  [k: string]: any;
}

export interface AssetStoryblok {
  _uid?: string;
  id: number;
  alt?: string;
  name: string;
  focus?: string;
  source?: string;
  title?: string;
  filename: string;
  copyright?: string;
  fieldtype?: string;
  meta_data?: null | {
    [k: string]: any;
  };
  is_external_url?: boolean;
  [k: string]: any;
}

export interface RichtextStoryblok {
  type: string;
  content?: RichtextStoryblok[];
  marks?: RichtextStoryblok[];
  attrs?: any;
  text?: string;
  [k: string]: any;
}

export interface GallerySlideStoryblok {
  image?: AssetStoryblok;
  caption?: RichtextStoryblok;
  _uid: string;
  component: "GallerySlide";
  [k: string]: any;
}

export interface HeadlineStoryblok {
  text: string;
  _uid: string;
  component: "Headline";
  [k: string]: any;
}

export interface HeroSlideStoryblok {
  title?: string;
  description?: RichtextStoryblok;
  imagePortrait?: AssetStoryblok;
  imageLandscape?: AssetStoryblok;
  videoPortraitID?: string;
  videoLandscapeID?: string;
  variant: "" | "fullscreen" | "backgroundColor" | "backgroundImage";
  _uid: string;
  component: "HeroSlide";
  [k: string]: any;
}

export interface InterviewStoryblok {
  headline?: string;
  headingOrder: string;
  questions?: InterviewItemStoryblok[];
  _uid: string;
  component: "Interview";
  [k: string]: any;
}

export interface InterviewItemStoryblok {
  question: string;
  answerOne?: RichtextStoryblok;
  answerTwo?: RichtextStoryblok;
  _uid: string;
  component: "InterviewItem";
  [k: string]: any;
}

export type MultilinkStoryblok =
  | {
      id?: string;
      cached_url?: string;
      anchor?: string;
      linktype?: "story";
      target?: "_self" | "_blank";
      [k: string]: any;
    }
  | {
      url?: string;
      cached_url?: string;
      anchor?: string;
      linktype?: "asset" | "url";
      target?: "_self" | "_blank";
      [k: string]: any;
    }
  | {
      email?: string;
      linktype?: "email";
      target?: "_self" | "_blank";
      [k: string]: any;
    };

export interface NavigationLinkStoryblok {
  label: string;
  link: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  _uid: string;
  component: "NavigationLink";
  [k: string]: any;
}

export interface PageStoryblok {
  body?: (
    | RichTextStoryblok
    | GalleryStoryblok
    | TextWriteOnStoryblok
    | VideoPlayerResponsiveStoryblok
    | InterviewStoryblok
  )[];
  metaTitle?: string;
  metaDescription?: string;
  metaImage?: AssetStoryblok;
  _uid: string;
  component: "Page";
  [k: string]: any;
}

export interface ProjectStoryblok {
  title?: string;
  subtitle?: string;
  heroSlides: HeroSlideStoryblok[];
  information?: (
    | GalleryStoryblok
    | HeadlineStoryblok
    | TextStoryblok
    | VideoPlayerStoryblok
    | StorefrontProjectStoryblok
  )[];
  metaTitle?: string;
  metaDescription?: string;
  metaImage?: AssetStoryblok;
  _uid: string;
  component: "Project";
  [k: string]: any;
}

export interface ProjectCarouselStoryblok {
  _uid: string;
  component: "ProjectCarousel";
  [k: string]: any;
}

export interface RichTextStoryblok {
  textSize: "" | "normal" | "large";
  headline?: string;
  headingOrder: string;
  headlineAsBadge?: boolean;
  subline?: string;
  text?: RichtextStoryblok;
  _uid: string;
  component: "RichText";
  [k: string]: any;
}

export interface RichTextBadgeStoryblok {
  label: string;
  headingOrder?: string;
  _uid: string;
  component: "RichTextBadge";
  [k: string]: any;
}

export interface RichTextButtonStoryblok {
  label: string;
  link: Exclude<MultilinkStoryblok, {linktype?: "asset"}>;
  _uid: string;
  component: "RichTextButton";
  [k: string]: any;
}

export interface SiteConfigurationStoryblok {
  tagline?: string;
  navigation?: NavigationLinkStoryblok[];
  socialLinks?: NavigationLinkStoryblok[];
  legalLinks?: NavigationLinkStoryblok[];
  contact?: RichtextStoryblok;
  copyright: string;
  _uid: string;
  component: "SiteConfiguration";
  [k: string]: any;
}

export interface StorefrontStoryblok {
  headline?: string;
  ctaLabel?: string;
  ctaUrl?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  _uid: string;
  component: "Storefront";
  [k: string]: any;
}

export interface StorefrontProjectStoryblok {
  headline?: string;
  ctaLabel?: string;
  ctaUrl?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  products?: StoreProductStoryblok[];
  _uid: string;
  component: "StorefrontProject";
  [k: string]: any;
}

export interface StoreProductStoryblok {
  image: AssetStoryblok;
  title: string;
  soldOut?: boolean;
  link: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  _uid: string;
  component: "StoreProduct";
  [k: string]: any;
}

export interface TextStoryblok {
  text: RichtextStoryblok;
  textSize: "" | "normal" | "large";
  _uid: string;
  component: "Text";
  [k: string]: any;
}

export interface TextWriteOnStoryblok {
  headline?: string;
  headingOrder: string;
  text?: RichtextStoryblok;
  _uid: string;
  component: "TextWriteOn";
  [k: string]: any;
}

export interface VideoPlayerStoryblok {
  videoID: string;
  aspectRatio: "" | "16:9" | "9:16";
  _uid: string;
  component: "VideoPlayer";
  [k: string]: any;
}

export interface VideoPlayerResponsiveStoryblok {
  videoIdLandscape: string;
  videoIdPortrait?: string;
  aspectRatio: "" | "16:7" | "16:9" | "fullscreen";
  showControls?: boolean;
  _uid: string;
  component: "VideoPlayerResponsive";
  [k: string]: any;
}

export interface VideoTextOvrlayStoryblok {
  columnOne?: RichtextStoryblok;
  columnTwo?: RichtextStoryblok;
  videoIdLandscape: string;
  videoIdPortrait?: string;
  _uid: string;
  component: "VideoTextOvrlay";
  [k: string]: any;
}
