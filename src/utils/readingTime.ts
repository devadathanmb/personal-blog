import getReadingTime from "reading-time";

/**
 * Calculate reading time for blog post content
 * @param content - The markdown content of the blog post
 * @returns Reading time string (e.g., "5 min read")
 */
export function calculateReadingTime(content: string | undefined): string {
  if (!content) return "0 min read";
  
  const result = getReadingTime(content);
  return result.text;
}
