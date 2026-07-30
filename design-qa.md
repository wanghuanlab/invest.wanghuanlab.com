# Homepage redesign QA

## Evidence

- Source visual truth: `/Users/wanghuan/.codex/generated_images/019fb1ef-ff3e-77b2-ae6b-c77add9eaa13/exec-582f7e15-01a5-415b-aa64-dcb3e7fc8159.png`
- Implementation capture: `/tmp/invest-lab-homepage-implementation-final.png`
- Combined comparison: `/tmp/invest-lab-homepage-comparison.png`
- Route and state: `/`, desktop homepage at the top of the document.
- Reference pixels: 2048 × 1280. Implementation capture: 1280 × 720 CSS pixels, rendered at browser default density. The source was normalized to a 1280 × 720 top-of-page crop for the combined comparison; the comparison focuses on the above-the-fold hero.

## Comparison history

1. Initial implementation placed the left hero copy too low because it was vertically centered beside the longer reading panel.
   - Fix: changed the desktop hero grid to top-align both columns.
   - Post-fix evidence: the final implementation capture shows the eyebrow, title, CTA, theme links, and recommendation panel within the same opening scan path.

## Findings

- No actionable P0, P1, or P2 findings remain for the selected direction.
- Fonts and typography: the existing Instrument Sans / Source Sans / IBM Plex Mono hierarchy is retained. The large display title, metadata, and small navigation are legible and clearly tiered.
- Spacing and layout rhythm: the previous empty hero is replaced with a balanced two-column research layout. The title and primary action appear early in the viewport; the reading panel provides an equally weighted destination on the right.
- Colors and visual tokens: the existing ink navy, copper-green accent, pale paper, and graph-paper grid remain unchanged. Borders stay thin and square, without shadows, rounded panels, or gradients.
- Image quality and asset fidelity: the existing meaningful six-path investment illustration is used as the selected article preview with a controlled crop and no substitute placeholder.
- Copy and content: all visible content is sourced from the current Markdown articles and topic metadata. The homepage feature, update list, CTA, and topic links are real routes.
- Interaction check: `浏览主题` was activated successfully and navigated to `#topics` (scroll position 1503.5); article, topic, and About links are rendered as real router links.

## Focused-region comparison

The hero was compared in a combined source/implementation view. The implementation intentionally uses the live article title, date, summary, and illustration rather than the mock's fictional example content. This preserves the selected visual structure while keeping the content system authoritative.

## Follow-up polish

- [P3] If the article catalog grows, consider a dedicated `cover` frontmatter field so each recommended article can provide its own preview image without the homepage knowing a filename.

## Implementation checklist

- [x] Preserve the existing brand system and navigation.
- [x] Replace the empty hero with a live research index.
- [x] Surface the manually featured article and recent updates above the fold.
- [x] Keep topic navigation and the primary CTA functional.
- [x] Verify the browser-rendered homepage and run automated checks.

final result: passed
