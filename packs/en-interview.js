window.PACK = {
  name: "en-interview",
  displayName: "EN Interview",
  questions: [
    {
      id: 1,
      title: "tell me about yourself",
      variants: [
        { text: `Hi, my name is Juntao Xue. I'm currently based in Tokyo and finishing a degree in History at Rikkyo University, where I focus on institutional systems and how complex structures evolve over time.

Alongside my studies, I've been working on several engineering projects, mainly around system design and product prototyping.

My main project is called Spiral, which explores how event histories can be represented as structured systems instead of simple mutable state.

Recently I've been focusing on building full-stack prototypes with React, Node, and PostgreSQL, and turning research-style ideas into usable software.`, audio: "recordings/en-interview/q1/a1.m4a" },

        { text: `I'm Juntao Xue, a product-oriented engineer currently based in Tokyo.

My background is actually in history, but my work has gradually moved toward building systems and developer tools. I'm especially interested in how complex systems manage events and state.

Most of my recent work has been around a project called Spiral, where I designed an execution model based on append-only event histories.

In practice I spend most of my time building full-stack prototypes and experimenting with system architecture and product interaction design.`, audio: "recordings/en-interview/q1/a2.m4a" }
      ]
    },
    {
      id: 2,
      title: "why do you want to work here",
      variants: [
        { text: `What interests me about your company is the focus on building real products rather than just isolated technical components.

I enjoy environments where engineers are involved not only in implementation but also in shaping how the system and the product evolve.

From what I've seen, your team seems to value thoughtful system design and practical engineering, which aligns well with how I like to work.`, audio: "recordings/en-interview/q2/a1.m4a" },

        { text: `One reason I'm interested in this role is that your work sits at the intersection of product design and system engineering.

In my own projects I've spent a lot of time thinking about how architecture decisions affect usability and developer workflows.

So I'm particularly excited about opportunities where engineering decisions directly influence the user-facing product.`, audio: "recordings/en-interview/q2/a2.m4a" }
      ]
    },
    {
      id: 3,
      title: "describe a challenging technical problem",
      variants: [
        { text: `One challenging problem I worked on was designing the execution model for the Spiral system.

Originally the system relied on traditional mutable state, but this made it difficult to reason about how the system reached a particular state.

To address that, I redesigned the core to use an append-only event graph. Instead of overwriting state, every change becomes a new event, and the system computes a recent view from the causal relationships between events.

The main challenge was designing rules that kept the model consistent while still making it usable in practice.`, audio: "recordings/en-interview/q3/a1.m4a" },

        { text: `A technical challenge I faced was figuring out how to represent complex event histories in a way that was both traceable and efficient.

Early versions of my project used a more conventional state-update approach, but debugging and reasoning about the system became difficult.

I eventually switched to an append-only event model, where state is derived rather than mutated.

That change required redesigning several parts of the system, but it made the behavior much easier to understand and debug.`, audio: "recordings/en-interview/q3/a2.m4a" }
      ]
    },
    {
      id: 4,
      title: "tell me about a project you're proud of",
      variants: [
        { text: `One project I'm particularly proud of is the Spiral prototype platform.

The goal was to take a fairly abstract system design idea and turn it into something people could actually interact with.

I built a full-stack platform where users can define fragments and observe how event relationships evolve over time.

The most interesting part for me was designing the interface so that users could understand what the system was doing without needing to read the underlying code.`, audio: "recordings/en-interview/q4/a1.m4a" },

        { text: `A project I'm proud of is an experimental system I built called Spiral.

The idea was to explore a different way of handling event histories in software systems.

I implemented the core execution model and then built a prototype platform around it so users could interact with the system through a structured editor.

It was rewarding because it combined system architecture, implementation, and product design in a single project.`, audio: "recordings/en-interview/q4/a2.m4a" }
      ]
    },
    {
      id: 5,
      title: "what are your strengths as an engineer",
      variants: [
        { text: `One of my strengths is being able to think about systems at a structural level.

When I work on a problem, I usually try to understand the underlying model first before jumping into implementation.

That approach has helped me when designing systems like Spiral, where the execution model and data structure have a big impact on how the system behaves.

I also enjoy bridging the gap between architecture decisions and the user-facing product.`, audio: "recordings/en-interview/q5/a1.m4a" },

        { text: `I think one of my strengths is turning abstract ideas into working prototypes.

I often start with a conceptual problem, design a simple execution model around it, and then build a full-stack prototype to test whether the idea actually works in practice.

That process helps me move quickly from exploration to something tangible that people can interact with.`, audio: "recordings/en-interview/q5/a2.m4a" }
      ]
    },
    {
      id: 6,
      title: "describe a technical project or experience",
      variants: [
        { text: `One project I spent a lot of time on recently is a system called Spiral.

The original idea was to explore how complex event histories could be represented in software systems in a more transparent way.

Instead of mutating state directly, the system stores events in an append-only structure and derives the current state from their relationships.

I implemented the core execution model and later built a prototype platform so users could interact with it through a structured editor.

What I enjoyed most about the project was connecting the system design with a usable product interface.`, audio: "recordings/en-interview/q6/a1.m4a" },

        { text: `A project that influenced how I think about system design is something I built called Spiral.

The main goal was to experiment with representing system behavior through explicit event histories rather than traditional mutable state.

I designed a small execution model for handling those events and implemented a prototype to see how the idea worked in practice.

Through that process I learned a lot about how architectural choices affect usability and debugging.`, audio: "recordings/en-interview/q6/a2.m4a" },

`One technical project I worked on explored how software systems manage sequences of events.

I built an experimental system where events are stored in an append-only graph, and the system computes a meaningful "recent state" from their causal relationships.

This approach made it easier to understand how the system reached a particular state.

The project eventually became the basis for a small prototype platform where users could interact with the model through a visual editor.`,

`Recently I've been working on a project that focuses on system architecture and execution models.

The idea was to experiment with a different way of representing system state by using event histories instead of destructive updates.

I implemented the core logic and then built a small platform around it to test how users could interact with the system.

It was interesting because it combined backend system design with user-facing product considerations.`,

`One thing I enjoy doing is taking abstract ideas and turning them into working prototypes.

For example, in one project I explored how event-driven systems could be represented more explicitly.

I designed a small execution model, implemented it, and then built a simple interface around it so people could experiment with the concept.

That process helped me understand how system architecture decisions affect the usability of the final product.`
      ]
    }
  ]
};
