import { slugifyStr } from "@utils/slugify";
import Datetime from "./Datetime";
import type { CollectionEntry } from "astro:content";

export interface Props {
  href?: string;
  frontmatter: CollectionEntry<"blog">["data"];
  secHeading?: boolean;
}

export default function Card({ href, frontmatter, secHeading = true }: Props) {
  const { title, pubDatetime, modDatetime, description, readingTime } =
    frontmatter;

  const headerProps = {
    style: { viewTransitionName: slugifyStr(title) },
    className: "text-lg font-medium decoration-dashed hover:underline",
  };

  return (
    <li className="my-6">
      <div className="group relative rounded-xl border border-transparent bg-transparent p-4 transition-all hover:border-skin-line/50 hover:bg-skin-card/50 hover:shadow-lg hover:backdrop-blur-sm">
        <a
          href={href}
          className="inline-block text-lg font-medium text-skin-accent decoration-dashed underline-offset-4 focus-visible:no-underline focus-visible:underline-offset-0"
        >
          {secHeading ? (
            <h2
              {...headerProps}
              className="text-xl font-bold text-skin-accent group-hover:text-skin-accent"
            >
              {title}
            </h2>
          ) : (
            <h3
              {...headerProps}
              className="text-xl font-bold text-skin-accent group-hover:text-skin-accent"
            >
              {title}
            </h3>
          )}
        </a>
        <Datetime
          pubDatetime={pubDatetime}
          modDatetime={modDatetime}
          readingTime={readingTime}
        />
        <p className="mt-2 text-skin-base opacity-90">{description}</p>
      </div>
    </li>
  );
}
