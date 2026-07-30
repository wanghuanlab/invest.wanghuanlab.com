export function getScrollPosition(to: { hash: string }): { el: string } | { top: number } {
  return to.hash ? { el: to.hash } : { top: 0 }
}
