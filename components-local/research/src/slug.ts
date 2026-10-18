/**
 * Research slug predicate, shared by the condition registration (index.ts)
 * and the component itself (ResearchPage.tsx).
 */
export function isResearchSlug(slug: string): boolean {
  return slug === "research/index" || slug.startsWith("research/")
}
