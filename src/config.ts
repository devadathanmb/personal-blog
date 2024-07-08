import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://devadathanmb.tech", // replace this with your deployed domain
  author: "Devadathan M B",
  desc: "Devadathan's corner of life on the internet",
  title: "Devadathan",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerPage: 3,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
};

export const LOCALE = {
  lang: "en", // html lang code. Set this empty and default will be "en"
  langTag: ["en-EN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/devadathanmb",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/devadathan-m-b-804876257",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:devadathanmb@gmail.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: true,
  },
  {
    name: "Discord",
    href: "https://discord.com/users/dev_on_discrd",
    linkTitle: `${SITE.title} on Discord`,
    active: true,
  },
  {
    name: "Telegram",
    href: "https://telegram.me/devOnTelegram",
    linkTitle: `${SITE.title} on Telegram`,
    active: true,
  },
];
