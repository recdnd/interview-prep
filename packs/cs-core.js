window.PACK = {
  name: "cs-core",
  questions: [
    {
      id: 1,
      title: "Spiral system design",
      variants: [
`10s
I built a system called Spiral that explores how event histories can be represented structurally instead of relying on mutable state.

The main challenge was designing an execution model that remained simple while still being practical to use.`,

`20s
One project I've been working on is called Spiral.

It explores how software systems can represent event histories using an append-only structure instead of traditional mutable state.

The main challenge was designing an execution model that kept the system understandable while still being practical to implement.`,

`40s
One project I've spent a lot of time on is called Spiral.

The idea started from a question about how software systems represent history and state.

Instead of mutating state directly, Spiral records events in an append-only structure and derives the current state from their relationships.

Early on the architecture became too complex, so I simplified the model and focused on the core execution rules.

Later I built a prototype platform so people could interact with the system.`,

`90s
One project I've spent a lot of time on is called Spiral.

The project started from a conceptual question: how can software systems represent event histories in a way that's easier to reason about?

Traditional systems rely heavily on mutable state, which can make it difficult to understand how the system reached a particular condition.

In Spiral I experimented with an append-only event structure, where every change becomes a new event and the system derives the current state from relationships between those events.

Early in development the architecture became overly complex because I tried to support too many features.

Eventually I simplified the design and focused on the core execution model.

After that I built a prototype platform where users could interact with the system through a structured editor.

What I enjoyed most was connecting system architecture with a usable interface.`
      ]
    },
    {
      id: 2,
      title: "Robotics teamwork story",
      variants: [
`10s
During a robotics competition a wheel came off during a match.

Our team quickly divided tasks and replaced it so we could continue.`,

`20s
During a robotics competition I worked on a small team responsible for maintaining the robot.

In one match a wheel came off, so we had to react quickly and divide tasks to repair it.`,

`40s
During a robotics competition I worked on a small team responsible for maintaining the robot.

In one match a wheel came off during operation.

We reacted quickly and divided tasks immediately.

One teammate stabilized the robot while another teammate and I replaced the wheel assembly.

It showed me how important communication and coordination are in a team.`,

`90s
During a robotics competition I worked as part of a small team responsible for building and maintaining the robot.

During one of the matches a wheel came off while the robot was operating.

Because the match was still ongoing we had to react quickly.

We immediately divided responsibilities. One teammate stabilized the robot while another teammate and I replaced the wheel assembly.

Even though it was stressful the team stayed calm and focused on solving the problem step by step.

That experience taught me how important communication and coordination are when unexpected problems happen in a team environment.`
      ]
    },
    {
      id: 3,
      title: "Product oriented engineering mindset",
      variants: [
`10s
I enjoy working on problems where system architecture and user experience intersect.`,

`20s
I'm particularly interested in building systems where architecture and product usability come together.

I like thinking about both how the system works internally and how people interact with it.`,

`40s
I tend to approach engineering problems from both a system design and product perspective.

When designing systems I think not only about the internal architecture but also how users will understand and interact with it.

This perspective influenced projects like Spiral, where I tried to turn an abstract system idea into something people could actually use.`,

`90s
One thing that shapes how I approach engineering is thinking about both system architecture and product usability.

I enjoy working on problems where the internal structure of the system and the user experience influence each other.

When building the Spiral prototype I wasn't only focused on the execution model itself.

I also designed an interface that would make the system understandable for users who didn't know the internal implementation.

That combination of system design and product thinking is something I find very interesting and it's the kind of work I hope to continue doing as an engineer.`
      ]
    }
  ]
};
