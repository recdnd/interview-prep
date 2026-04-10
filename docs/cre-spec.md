# CRE Spec

## Name
CRE = Conversation Relay Engine

## Purpose
CRE is a zero-prompt conversational support component.

It combines two helper styles:

- speak-oriented continuation support
- relay-oriented conversational flow support

It does not generate final answers.  
It provides short, directly usable blocks that help the user continue speaking or keep the conversation moving.

## Why CRE exists
In real-time conversation, the problem is often not lack of knowledge but loss of flow.

Sometimes the user needs:
- a way to begin speaking
- a way to keep speaking
- a way to send the conversation back naturally

CRE exists as a minimal foreground support layer for this.

## Modes

### auto
Automatically infer whether the current situation is better served by:
- `speak`
- `relay`

### speak
Generate a short continuation block for speaking:
- opening
- middle
- closing

### relay
Generate a short conversational relay block:
- acknowledgment
- light follow-up question
- continuation / buffer

## Output formats

### Speak mode
[起手]  
...

[中段]  
...

[収束]  
...

### Relay mode
[接球]  
...

[軽い反問]  
...

[つなぎ]  
...

## Inference logic
In auto mode, CRE infers mode from the active question title.

Heuristic:
- UX / system / explanation / strength / worldview topics -> speak
- reverse-question / discussion / open conversational topics -> relay
- fallback -> speak

## Relationship to other tools
- Packs = structured answer sources
- Episodes = examples and story material
- CCE = direct continuation support
- CBL = conversational catch/relay support
- CRE = unified mixed entry point

## UI behavior
CRE is a fixed floating helper box.

It should:
- remain lightweight
- require no prompt
- support one-click generation
- support manual mode override
- avoid interfering with existing panels

## Rendering
Render content using `textContent`.
Do not use `innerHTML`.

## Design language
CRE visually belongs to the same system as the existing floating UI components while staying distinct from CCE and CBL.
