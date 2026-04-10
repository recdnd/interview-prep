# CCE Spec

## Name
CCE = Conversation Continuation Engine

## Purpose
CCE is a lightweight conversational continuation helper built into the interview support UI.

It is designed to reduce hesitation and cognitive load by providing short, directly usable spoken continuation units.

CCE does not generate full answers.  
Instead, it produces a minimal 3-part continuation block:

- opening
- middle
- closing

This allows the user to begin speaking, maintain flow, and close naturally.

## Why CCE exists
The main pack system is useful for storing structured answers and examples, but in high-pressure situations the user may not have time to search, switch, and assemble language manually.

CCE exists to provide an immediate foreground fallback layer.

It is especially useful for:
- initiating a response
- recovering from a pause
- extending a response naturally
- landing an answer safely

## Output format
CCE always outputs three short sections:

[起手]  
...

[中段]  
...

[収束]  
...

These sections are short enough to read quickly and flexible enough to attach to many topics.

## Modes
CCE supports three modes:

### general
Safe default language for broad continuation.

### ux
Language biased toward:
- UX
- interaction
- user understanding
- usability
- structure transmission

### system
Language biased toward:
- architecture
- structural fit
- consistency
- state/history
- trade-offs
- explanation

## Mode control
CCE supports:
- manual mode switching (`G` / `UX` / `SYS`)
- automatic mode inference from active question title (`A`)

Manual mode has priority over auto mode until changed by the user.

## Relationship to packs
CCE is not a replacement for packs.

Recommended division:
- `my-model` = core worldview answers
- `episodes` = story / example answers
- `CCE` = continuation support

## UI behavior
CCE is implemented as a fixed floating helper box.

Design goals:
- always visible
- low visual weight
- fast to use
- no prompt required
- one-click generation

## Rendering safety
CCE content is rendered as plain text via `textContent`.

Do not use `innerHTML`.

## Design language
CCE uses a translucent orange/yellow visual style based on `#ffb700`, consistent with the broader UI language while remaining visually distinct from pack drawers.

## Future extension ideas
- partial reroll for start / middle / end only
- mode memory in localStorage
- question-sensitive generation bias
- richer domain pools such as:
  - strength
  - system design
  - UX
  - product
  - historical / research framing
