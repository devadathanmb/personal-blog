import type socialIcons from "@assets/socialIcons";

export type Site = {
  website: string;
  author: string;
  desc: string;
  title: string;
  ogImage?: string;
  lightAndDarkMode: boolean;
  postPerPage: number;
  postPerIndex: number;
  scheduledPostMargin: number;
  showArchives: boolean;
  showBackButton: boolean;
  timezone: string;
  lang: string;
  dir: string;
  profile: string;
  dynamicOgImage: boolean;
  editPost: {
    enabled: boolean;
    url: string;
    text: string;
  };
};

export type SocialObjects = {
  name: keyof typeof socialIcons;
  href: string;
  active: boolean;
  linkTitle: string;
}[];
