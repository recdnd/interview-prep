# UI Helper Layout

## Scope
This document defines the shared layout rules for the floating helper family:

- `QN`
- `CCE`
- `CRE`
- `CBL`

These four components are one unified helper-card system.  
Future spacing/size/padding/scroll changes must be applied to all four together, not patched individually.

## Core rules (mandatory)

- Fixed card size (no auto-grow).
- Internal scroll only (`overflow-y: auto` in content region).
- Floating controls must not reserve layout height.
- Compact text density (no fake spacer lines).
- No overlap between helper cards.
- **Tactical density:** prefer tight insets and information density over “breathing room”. Helper cards are foreground tools, not long-form reading panels.

## Shared structure

Each helper uses the same internal geometry:

- `.helper-card` (outer fixed container)
- `.helper-controls-top` — **floating overlay** only: `position: absolute`, higher `z-index` than `.helper-content`. It must **not** reserve space in the scrollable region (do not push `.helper-content` down with extra `top` inset for the control row).
- `.helper-content` (absolute scroll area, `z-index` below top/bottom controls). **Text may scroll underneath** the top control row; overlap under the buttons is acceptable. Its box is the **content viewport**: inset from the card edge by **`--helper-content-inset` (~2px) on all four sides** (`top` / `right` / `bottom` / `left`). Top/bottom floating controls do **not** change this viewport size (no extra header/footer inset on `.helper-content`).
- `.helper-controls-bottom` — same overlay idea at the bottom-right (`⟳` etc.).

`has-top-controls` on a card only marks that it uses a top row; it must **not** imply extra content `top` padding (legacy “clear the title strip” behavior is forbidden).

`QN` uses the same structure with a `textarea` inside `.helper-content`.

### Mode UI (minimal chrome)

- Do **not** show long mode labels in the card chrome (no `SPEAK`, `RELAY`, `AUTO`, etc. as visible text).
- Use **short controls only** (e.g. letter buttons `A` / `S` / `R` on `CRE`). State is conveyed with `.active` on the pressed control and `aria-label` on buttons where needed.

## Partial reroll (`CCE` / `CRE` / `CBL`)

Three-part cards are built from **block-level DOM**, not one plain string:

- `.helper-block` with optional `data-part` (`start` | `mid` | `end` | `ack` | `ask` | `expand`) — **no outer margin/padding** on the block itself except a small **`2px`** gap between consecutive blocks (`+ .helper-block`), so text can align with the content viewport edges.
- `.helper-block-label` (bracket label, not the click target)
- `.helper-block-text` (click target)

**JS state** holds the current line per part (`cceRendered`, `cblRendered`, `creRendered` in `script.js`). Full generate (⟳ / mode buttons) repicks all parts and re-renders. **Click on `.helper-block-text`** updates only that part’s string in state and in the DOM; other blocks stay unchanged.

**CRE:** In speak mode, partial reroll uses `CHEAT` pools like CCE; in relay mode, uses `CBL` pools. Resolved mode is stored on `creRendered.resolvedMode`; mid-line pool key is `speakSubtype` when in speak mode.

**Interaction:** `.helper-block-text` uses shared CSS: hover and `.is-rerolling` turn text `#ff0000`; click adds `is-rerolling`, runs the part’s reroll closure, removes the class after **200ms**.

## Shared geometry

Desktop default:

- width: `200px`
- height: `140px`
- min/max height locked to `140px`
- **Content viewport:** `.helper-content` is positioned with **`--helper-content-inset` (≈2px)** from the **inner** card edge on **top, right, bottom, and left** — one rule for the whole family (`CCE`, `CRE`, `CBL`, `QN`). Do not use asymmetric content insets (e.g. larger top) unless every helper card changes together.

`QN` may use `.helper-card--narrow` (slightly narrower) but follows the same fixed-height logic.

## Shared density

- `.helper-card` outer padding is `0`.
- The scrollable **content viewport** (`.helper-content`) uses the **same ~2px inset on all four sides** via `--helper-content-inset`. Nested nodes (`textarea`, `.helper-block`, labels, text lines) must **not** add extra margin/padding that steals space from that viewport (audit on all four helpers).
- Top / bottom controls are overlays: they do **not** shrink or offset the `.helper-content` box; content extends under them until scrolled.
- Bottom action button floats at bottom-right.
- Content is compact and scrollable.

## Stack positioning

### Desktop (`min-width: 1024px`)

Right-side stack (`CCE`, `CRE`, `CBL`) is **one vertical helper stack**, `position: fixed`, anchored to the **main column** (same horizontal contract as `.wrap`: `max-width: 36rem`, centered), **not** to the viewport’s right edge.

**Horizontal (`left`, shared on all three IDs)**

CSS variables (desktop breakpoint only unless noted):

- `--helper-main-column-max` — matches `.wrap { max-width }` (**36rem**).
- `--helper-after-main-gap` — gap between main column’s right edge and the stack (**12px**).
- `--pack-panel-fixed-right`, `--pack-panel-fixed-width` — shared with `#pack-panel` positioning.
- `--helper-to-pack-gap` — clearance between stack and pack panel (**12px**).
- `--helper-stack-card-w` — card width (global `:root`, default **200px**; must match `.helper-card` width).

Computed intent:

- `idealLeft = (100vw - mainMax) / 2 + mainMax + afterMainGap`
- `maxLeft = 100vw - packRight - packWidth - toPackGap - cardW`
- `left: max(14px, min(idealLeft, maxLeft))`, `right: auto`

If the viewport is too narrow for both constraints, `min(idealLeft, maxLeft)` yields a position that **prioritizes not overlapping the pack panel** (may crowd the main column in extreme widths).

**Vertical**

- Shared step: `--helper-stack-vstep` (currently **150px** = **140px** card height + **10px** visible gap).
- `CCE`: `top: 16%`
- `CRE`: `top: calc(16% + var(--helper-stack-vstep))`
- `CBL`: `top: calc(16% + 2 * var(--helper-stack-vstep))`

When changing pack panel geometry or helper width, **update the shared CSS variables** (`--pack-panel-fixed-*`, `--helper-stack-card-w`, gaps) so the stack stays non-colliding.

### Mobile (`max-width: 1023px`)

Unchanged chain: fixed to bottom-right with `bottom` offsets; `left: auto`, `right: 12px`.

### Left-side

- `QN`: left of mint question panel, slightly above its midpoint.

No content-dependent reflow is allowed.

## Formatting policy

Generated helper text should be compact:

- section label line
- immediate content line
- next section label

No blank spacer lines unless strictly necessary.

## Anti-patterns (do not reintroduce)

- Auto height based on generated text.
- Header rows that reserve large vertical space.
- Ad hoc per-tool spacing rules (e.g. different `left` / `right` per helper card on desktop).
- Pinning the right-side stack to `right: Npx` on the viewport instead of the **main column + pack clearance** formula above.
- Hidden overlap that depends on content length.
- Replacing the three-part layout with a single `textContent` blob (breaks partial reroll and state).
- Pushing `.helper-content` down to “clear” the top mode row (breaks overlay + scroll-under behavior).
- Visible full-word mode labels (`SPEAK`, `RELAY`, …) in the card chrome instead of minimal controls.
- Asymmetric or “airy” content insets (e.g. only shrinking left/right) or wrapper margin/padding that prevents the text viewport from sitting **~2px** from the card edge on all sides.
