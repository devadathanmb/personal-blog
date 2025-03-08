import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "./slugify";

type GlobResult = {
  frontmatter: CollectionEntry<"blog">["data"];
};

export const getReadingTime = async () => {
  const globPosts = import.meta.glob("../content/blog/*.md");
  const mapFrontmatter = new Map<string, string | undefined>();

  await Promise.all(
    Object.entries(globPosts).map(async ([_, globPost]) => {
      const post = (await globPost()) as GlobResult;
      const frontmatter = post.frontmatter;
      mapFrontmatter.set(
        slugifyStr(frontmatter.title),
        frontmatter.readingTime
      );
    })
  );

  return mapFrontmatter;
};

const getPostsWithRT = async (posts: CollectionEntry<"blog">[]) => {
  const mapFrontmatter = await getReadingTime();
  return posts.map(post => {
    post.data.readingTime = mapFrontmatter.get(slugifyStr(post.data.title));
    return post;
  });
};

export default getPostsWithRT;
