# Blog Voice: First-Person, Anecdotal, Opinionated

The posts should read like someone thinking out loud after seeing something real, not like a polished memo about an abstract trend.

Start from a scene. A thing happened. I saw a PR. I tried to review a diff. I watched an agent confidently do the wrong thing. I was building something with Noah. I was sitting with a founder. Then make the point from there.

The voice is first person by default. Use "I" when the thought came from my experience. Use "we" only when the post is genuinely about a shared team habit or a collective failure. Avoid floating claims that sound like they came from a slide deck.

The shape is:

1. Tell the moment.
2. Say what felt wrong, funny, annoying, or revealing.
3. Make the argument.
4. Ground it in a concrete example.
5. End on the live wire, not a tidy conclusion.

## Review Pass Before Rewriting

Before rewriting any post, read it once and answer these questions in the margin, even if only mentally:

- Are we really saying something here, or are we arranging nice-sounding observations?
- What is the story? What happened, who was there, what did I see, build, break, review, misunderstand, or get annoyed by?
- Can someone reading this relate to the moment, or is it floating above their life?
- Can the reader picture the scene? If not, add concrete nouns: the PR, the laptop, the child, the worksheet, the room, the call, the number, the tool.
- Where does the post make the reader think, "ah, yes, I have seen this"?
- Which sentence would make a smart reader roll their eyes because it sounds like a LinkedIn post?
- Are we chewing the idea into the reader's mouth? If two sentences say the same thing, keep the sharper one and trust the reader.
- Did we explain the moral after the example already made it obvious?
- Would an image, chart, GIF, embedded video, screenshot, or tiny diagram make one point faster than another paragraph?
- Is there a concrete artifact by the end: a checklist, a rule, a question, a decision, a small example, or a line I would actually say?
- What would I cut if I had to remove 20 percent of the post?

The goal is not to make every post chatty. The goal is to make every post earned.

The tone can be blunt and a bit amused. It can say "wtf" if the moment earns it. It can use emphasis like "huuuuge" when the exaggeration is part of the human story. Don't sprinkle this everywhere. One vivid human phrase beats ten forced ones.

Good openings sound like:

> Recently I got asked to review a PR so large my laptop treated it like a personal attack.

> I had one of those moments where the code passed every check and still did the wrong thing.

> I was building a tiny thing for Noah and caught myself doing the exact thing I complain about at work.

Bad openings sound like:

> AI is changing the way software teams work.

> In modern engineering organizations, review quality is more important than ever.

> There are three key principles teams should consider.

Keep the opinions sharp. Don't say "this raises interesting questions." Say the thing: "You can't review a 200k-line PR. You can only pretend."

Use specific names, places, tools, and numbers. "A giant PR" is weaker than "a PR with roughly 200k changed lines." "The machine was slow" is weaker than "my 8-core Mac started wheezing before the diff even rendered."

## Visual Pass

Every article should get a visual pass before it is done. The question is not "can we add an image?" The question is "where would the reader understand faster if they saw it?"

Good visual candidates:

- A chart for a claim with a number, slope, comparison, or threshold.
- A screenshot when the actual interface, diff, object, or artifact matters.
- A GIF or short video when motion, sequence, timing, or awkwardness is the point.
- A meme, comic, or internet artifact when the reference is already doing cultural work in the post.
- A photo when the post is grounded in a place, object, build, trip, child activity, surf session, cottage, board, or physical thing.
- A small diagram when prose is explaining a loop, flow, failure mode, or decision tree.

Bad visual candidates:

- Default Wikimedia/stock-library photos of people at laptops, unless the actual person, place, or event matters.
- Decorative stock-ish images that only say "technology" or "thinking."
- Charts that repeat the paragraph without adding a shape, contrast, or joke.
- Generated SVGs that look like filler consulting diagrams.
- Screenshots with unreadable tiny text.
- Embeds that make the page feel alive but don't carry the argument.

Prefer original creator pages, official embeds, screenshots of the actual thing, or licensed media with a reason to be there. If a meme is doing the work, credit the creator/source and don't explain the joke to death.

Captions should earn their space. A caption can add the joke, the caveat, or the point of the image. Don't caption with "Chart showing..." if the image already shows it.

Let sentences vary. Some can be clipped. Some can ramble a bit when the speaker is telling a story. The blog should feel spoken, but edited.

Use profanity sparingly. It should mark disbelief, not replace thought.

Use jokes and references when they compress the point. The QA-engineer-walks-into-a-bar joke works because it names a real testing failure: checking absurd inputs while missing the first normal user request. Don't paste a joke in for color. Use the joke, then say the technical lesson in a clean sentence.

Sarcasm needs a precise target. Make fun of the broken loop, the fake term, the cargo-cult process, or the review theatre. Don't make fun of the underlying craft when the craft is sound. Example: "agentic test-driven development, huiiii" works only if the next sentence explains why real TDD is different.

Avoid tidy essay scaffolding. No "let's explore." No "in this post." No "at the end of the day." No "key takeaways." The reader should feel pulled through a story, not guided through a deck.

Avoid sincerity-signalling words. "Honest" is usually a tell: "the honest truth," "my honest thought," "let's be honest." If the sentence is true and specific, it doesn't need to announce that it is telling the truth.

Don't use negation stacks to fake precision. "Not a security ritual. Not a checklist." sounds punchy but often says nothing. Replace it with the concrete thing I would do, block, ask, or change.

Avoid process-detail precision when the point is human judgment. Phrases like "one person, named on the PR" sound like policy text. Prefer the artifact or behavior: "leave the scary comment," "show what you tried to break," "say what you still don't understand."

Headings must carry information. "Why this matters" and "A worked example" are usually placeholders. A good heading should make the reader think before the paragraph begins: "You can't review a 200k-line diff" is better than "The review problem."

Delete sentences that only gesture at meaning. If a sentence could appear in a LinkedIn post with no changes, cut it or replace it with a scene, a number, a name, a failure, or a decision.

Don't over-chew. Once a sentence lands, move on. Example smell: "It doesn't look like a mess. It looks like a person who knows what they're doing came through and tidied everything up." The second sentence can work; the first may just pre-chew it. Prefer the image over the explanation.

Every funny sentence still has a job. If it doesn't reveal character, sharpen the argument, or make a technical distinction easier to remember, cut it.

Don't stack clipped sentences as a substitute for thought. "Twenty minutes. One scary comment. No ceremony." sounds like generated punchiness unless each fragment adds something concrete. Prefer one plain sentence that says what the reader should do or see.

Be suspicious of tiny bridge sentences. "That matters." "Here's why." "The point is." "This is key." Ask five times whether the sentence is doing real work. Most of the time, delete it and let the next specific sentence carry the meaning.

Don't over-explain the moral. Trust the reader to get it once the example lands.

Avoid dragged endings. If the last few paragraphs only restate the point in moodier language, cut them. End with a concrete artifact instead: a checklist, a comment template, a decision rule, or the exact question I would ask on the next PR.

The final paragraph should not summarize the whole post. It should either leave the reader with the unresolved thing that made me write it in the first place or give them the concrete move I want them to try next.

Keep the existing banned words and banned structures from `AGENTS.md`. This style adds humanity; it does not permit generic startup prose.
