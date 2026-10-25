import { visit } from 'unist-util-visit'

/**
 * Flags documents that contain `remark-math` nodes, so the KaTeX stylesheet
 * is only linked on pages that actually render math.
 */
function remarkHasMath() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return (tree, file) => {
    let hasMath = false
    visit(tree, ['math', 'inlineMath'], () => {
      hasMath = true
      return false
    })
    file.data.astro.frontmatter.hasMath = hasMath
  }
}

export default remarkHasMath
