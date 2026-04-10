# Catch Ball Layer (CBL)

## Purpose

CBL (Catch Ball Layer) is a conversational support component designed to help the user maintain dialogue flow.

Unlike structured answer packs, CBL is not intended to provide full answers.  
Instead, it provides short conversational units that:

- acknowledge the other party's statement
- lightly reflect or validate it
- gently ask a follow-up question
- extend the interaction without pressure

## Output structure

Each generation produces three short lines:

1. acknowledgment
2. light follow-up question
3. continuation / buffer

These are designed to be immediately usable in spoken conversation.

## When to use

CBL is useful when:

- the user does not want to immediately give a full answer
- the user needs time to think
- the user wants to keep the conversation natural and interactive
- the user wants the interviewer to elaborate further

## When NOT to use

CBL is not intended for:

- answering technical questions directly
- replacing structured responses
- providing final conclusions

## Relationship with other components

- Packs = structured answers
- Episodes = examples / stories
- CCE = continuation for speaking
- CBL = conversational relay

## UI behavior

CBL is implemented as a small floating box.

Design goals:

- always available
- low cognitive load
- minimal interaction (one click)
- no prompt required

## Rendering

All content is rendered using `textContent`.

No HTML injection is used.

## Design philosophy

CBL focuses on:

- conversational naturalness
- light cognitive support
- flexibility across topics

It is intentionally simple and slightly ambiguous, allowing the user to adapt it to many contexts.
