window.PACK = {
  name: "en-work",
  questions: [
    {
      id: 1,
      title: "standup update",
      variants: [
`Yesterday I worked on the API integration for the fragment editor.
Today I'm continuing the backend cleanup and writing a few tests.
I don't have any major blockers right now, but I may need to double-check one part of the event flow.`,

`Yesterday I focused on the event history logic and cleaned up part of the data flow.
Today I'm planning to finish the remaining implementation and test a couple of edge cases.
At the moment I don't have any blockers.`,

`Yesterday I was mainly working on the editor side and checking how it connects to the backend.
Today I'll keep working on that and try to get it into a more stable state.
No blockers for now.`
      ]
    },
    {
      id: 2,
      title: "explaining a bug",
      variants: [
`I think the bug is happening because the frontend is assuming the state is already updated, but the backend response is arriving later than expected.
So the UI looks correct at first, and then it gets overwritten by stale data.`,

`From what I've seen so far, this looks like a state synchronization issue.
The actual data is being updated, but the interface is rendering an older value for a moment, which is why the behavior feels inconsistent.`,

`My current understanding is that the bug is not in the rendering itself.
It seems more likely that we're getting the right result too late, so the UI is briefly showing the wrong state before everything catches up.`
      ]
    },
    {
      id: 3,
      title: "asking for clarification",
      variants: [
`Just to make sure I understand correctly, do you want this behavior to happen automatically, or only after the user confirms the action?`,

`I want to clarify one thing before I continue.
Should I treat this as a UI-only change, or does the backend behavior also need to be updated?`,

`Can I quickly confirm the expected behavior here?
I want to make sure I'm solving the right problem before I move forward.`
      ]
    },
    {
      id: 4,
      title: "giving a status update",
      variants: [
`A quick update: the main implementation is already in place, and I'm currently testing a few edge cases before I consider it done.
If everything looks good, I should be able to wrap it up today.`,

`Just to keep you posted, the core part is working now.
I'm doing some cleanup and checking a few details, but overall it's moving in the right direction.`,

`The current status is pretty good.
The main functionality is already there, and what's left is mostly validation, cleanup, and making sure the behavior is consistent.`
      ]
    },
    {
      id: 5,
      title: "asking for help",
      variants: [
`Could you take a quick look at this when you have a moment?
I think I'm close, but I want to make sure I'm not missing something obvious in the current logic.`,

`I could use a second pair of eyes on this.
The implementation mostly works, but I'm not fully confident about one part of the flow.`,

`When you have time, could you help me check whether this approach makes sense?
I think it works, but I'd feel better getting another opinion before I move forward.`
      ]
    }
  ]
};
