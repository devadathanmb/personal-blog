export const SITE = {
  website: "https://devadathanmb.in",
  author: "Devadathan M B",
  profile: "https://devadathanmb.in",
  desc: "Devadathan's corner of life on the internet",
  title: "Devadathan",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 3,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true,
  editPost: {
    enabled: true,
    text: "Edit page",
    url: "https://github.com/devadathanmb/personal-blog/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr",
  lang: "en",
  timezone: "Asia/Kolkata",
} as const;
