# QN Spec

## Name
QN = Quick Note

## Purpose
QN is a lightweight floating note pad for immediate temporary notes.

It is designed to function as an external short-term memory surface during live use.

Typical use cases:
- writing down keywords
- keeping track of topics to return to
- noting company-specific terms
- storing immediate reminders or follow-up points

## Design principles
QN should be:

- immediate
- quiet
- persistent
- minimal

It should not require any save action, prompt, or mode switch.

## Features
QN supports:

- plain text input
- local persistence via localStorage
- automatic restore on page load
- one-click clear

QN does not support:

- markdown
- rich text
- multiple notes
- tagging
- sync
- formatting
- document structure

## UI behavior
QN is a fixed floating box.

It should remain visible and available, but visually lighter than the main content.

## Placement
Desktop:
- to the left of the mint-green question panel
- slightly above its midpoint

Mobile:
- simplified compact fallback
- avoid collision with other floating helpers

## Styling
QN uses a translucent blue visual language based on `#00a5f7`.

The component should feel part of the same UI family as the other helper panels, while remaining clearly separate in function.

## Rendering and persistence
QN uses a plain `<textarea>` and stores text in localStorage.

Storage key:
`pp_quick_note`

## Why QN exists
The main packs and helper generators support speech and interaction, but they do not provide a place for the user to store fleeting information.

QN fills that gap by acting as a simple always-available scratch layer.
