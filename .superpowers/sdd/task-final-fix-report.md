# Final review fixes

- Kept the shared `App.vue` shell at `max-w-6xl` and constrained Topic, Article, About, and Not Found views to `mx-auto w-full max-w-3xl`.
- Changed `getRecentArticles()` so an omitted limit returns every date-sorted article; Home now renders the complete latest list while the reading panel still slices its preview to three.
- Replaced the 1536×1024, 3,226,580-byte cover with a 960×640, 1,116,988-byte PNG and updated both frontmatter and article-body references.
- Added regression coverage for unlimited recent articles, complete Home latest rendering, reading-width wrappers, and the compressed cover path.
- Verification: `npm test && npm run build` passed with 38/38 tests and a successful Vite production build.
