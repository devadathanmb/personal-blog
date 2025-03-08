import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "@utils/slugify";

interface Props {
  project: CollectionEntry<"projects">;
}

export default function ProjectCard({ project }: Props) {
  const { data: frontmatter, slug } = project;
  const { title, description, techStack, repoUrl, demoUrl } = frontmatter;

  const headerProps = {
    style: { viewTransitionName: slugifyStr(title) },
    className:
      "text-xl font-semibold text-skin-base group-hover:text-skin-accent transition-colors duration-200",
  };

  return (
    <li className="my-6 rounded-md border border-skin-line bg-skin-card p-4 transition-all duration-200 hover:border-skin-accent hover:border-opacity-50 hover:shadow-md">
      <a href={`/projects/${slug}/`} className="group mb-3 block">
        <h2 {...headerProps}>{title}</h2>
        <p className="mt-2 text-sm text-skin-base opacity-90 group-hover:opacity-100">
          {description}
        </p>
      </a>

      {techStack.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1">
          {techStack.map(tech => (
            <span key={tech} className="gh-tag">
              {tech}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        {repoUrl && (
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="gh-button-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            View Source
          </a>
        )}
        {demoUrl && (
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="gh-button-secondary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            Live Demo
          </a>
        )}
      </div>
    </li>
  );
}
