const COLORS: Record<string, string> = {
  rates: '#1F6F5B',
  bonds: '#8B6914',
  stocks: '#0B3A5C',
  gold: '#C4A035',
  demographics: '#6B4C9A',
  housing: '#2F6F8F',
}

export function topicColor(slug: string): string {
  return COLORS[slug] ?? '#1F6F5B'
}
