---
title: "DHH Says Stop Writing Code. Cool. Who's Going to Clean Up the Mess?"
date: '10-13-2026'
heroImage: '/blog/is-coding-dead/is-coding-over.webp'
image: '/blog/is-coding-dead/is-coding-over.webp'
originalDatePublished:
description: "AI is coming for software engineering. And I'm scared shitless!"
author: 'Anthony Lombardi'
categories: [AI, ruby, rails]
tags: [ruby, AI]
draft: false
---



I think we're having the wrong conversation right now. David Heinemeier Hansson (DHH), the guy who gave us Ruby on Rails and arguably saved millions of developers from writing the same boilerplate until their souls left their bodies, recently announced that 37signals has essentially gone "pencils down" on hand-written code.

AI agents are writing the code now. DHH has even described himself as retired from professional programming.

Awesome… Cool. Cool. Cool. Cool.

![cool cool cool](/blog/is-coding-dead/coolcoolcool.gif)

Apparently, we're done writing code. Pack it up, everyone. It's been a good run.

I'm just going to sit here with my 13-plus years of professional software engineering experience, stare into the abyss, and contemplate whether I should've listened to my parents and become a doctor.

At least the common virus doesn't get rewritten in Rust overnight…

### I'm not entirely convinced DHH is right though.

I'm not saying AI isn't changing software engineering. It absolutely is. I'm saying we're confusing the ability to generate code with the ability to engineer software.

DHH is rewriting applications in different languages. Developers are rebuilding compilers in Rust. Entire services are being migrated with surprisingly little human intervention. That's genuinely impressive and Imma let them finish, but I keep coming back to one question. What happens when we put all this into a large, complicated production environment?

![imma let you finish](/blog/is-coding-dead/imma-let-you-finish.gif)

I'm not talking about a relatively isolated service with well-defined inputs and outputs. I'm talking about the kind of infrastructure where eight applications depend on each other, authentication flows through multiple systems, background jobs are processing thousands of records, and some undocumented business rule from 2017 is holding the entire thing together with duct tape and a dream.

I've worked on those systems. They're not theoretical. They're just Tuesday. And in those environments, writing the code was rarely the hardest part.

### The Bottleneck Isn't Code Review. It's Knowing Whether the Damn Thing Works.

Here's where I think the conversation starts going sideways. As AI generates more code, people naturally question whether traditional code review can keep up. And they're right to. If an agent can generate a week's worth of code in twenty minutes, having three engineers manually inspect every line is an obvious bottleneck. But eliminating code review doesn't magically solve the problem. It just moves it.

The real bottleneck becomes verification: how fast can we test a change against a realistic environment and know whether the system actually behaves correctly? Because passing a unit test doesn't mean your application works. Shocking, I know. Somewhere, a developer just whispered, "But it's green."

In production, the question isn't whether the code compiles. It's:

- Does it handle concurrency? Does it respect tenant boundaries?
- What happens when a downstream service becomes unavailable?
- What happens when a background job retries after partially completing its work?
- Does the database survive the new query patterns?
- Does it survive the one customer with 40,000 records and a Hotmail address from 2004?

And my personal favorite: what happens when everything works perfectly in development and production decides to become a flaming dumpster at 2:37 AM on a Thursday?

An AI agent can write code. Great! But if we can't give that agent a reliable way to determine whether its implementation works under realistic conditions, we're just generating failures faster. We've automated the construction of the house without checking whether the foundation can support it. Bold strategy.

### Give AI an Environment Where It Can Fail Fast.

Here's what I think the next major evolution in software engineering looks like. Not necessarily better code generation. Better environments for AI to validate its own work.

Imagine an engineering workflow where an agent receives a task and can:

1. Understand the architectural constraints and expected behavior.
2. Generate an implementation.
3. Spin up an isolated environment containing the necessary services and dependencies.
4. Run unit, integration, contract, security, and performance tests.
5. Observe the actual behavior of the system.
6. Identify failures, revise the implementation, and repeat.
7. Produce evidence that the changes satisfy the requirements before they're considered for production.

Not just a green CI pipeline. An actual feedback loop. An environment where AI can fail repeatedly, cheaply, and safely until the implementation satisfies measurable expectations. Then we're cooking with petrol.

Of course, this introduces another problem. Who defines those expectations? Who determines what correct behavior looks like? Who decides whether a performance regression is acceptable? Who identifies the architectural constraints that an agent shouldn't violate?

And who makes sure the tests themselves aren't complete garbage? Because an AI agent generating its own implementation and then congratulating itself with tests designed around that implementation isn't exactly my definition of quality assurance. That's a participation trophy with a GitHub Actions badge.

> "Quis custodiet ipsos custodes?" — Who watches the watchmen?

If the agent wrote the code and the tests, the answer is nobody.

### Architecture Doesn't Disappear Because Code Gets Cheap.

I think there's going to be a significant market for engineers who understand how to design systems rather than simply implement features. Not because AI can't eventually learn architecture. It already shows some impressive capabilities. But architecture isn't just choosing between Rails, Go, Rust, or whatever language we're collectively obsessed with this week.

- It's understanding trade-offs.
- It's deciding where domain boundaries belong.
- It's knowing when to split a service and when to leave the monolith alone.
- It's designing data models that won't become an absolute nightmare six months later.
- It's understanding that a technically elegant solution can still be a terrible business decision.

And perhaps most importantly, it's recognizing problems that nobody explicitly told you to look for.

Could AI eventually do all of that? Probably. But somebody still has to decide what the system is supposed to accomplish and which risks are acceptable. At least until the AI starts attending sprint planning and arguing with Product about scope creep.

Actually, you know what? AI can have that one.

### Rust Isn't the Answer. Neither Is Ruby. Neither Is Whatever Comes Next.

Another interesting part of this conversation is the sudden enthusiasm for rewriting everything in Rust.

Don't get me wrong. I'm a big fan of Rust. It's a fantastic language with strong safety guarantees and compelling performance characteristics. But watching the industry discover that AI can rewrite applications in Rust feels a little like watching someone buy a Ferrari because their commute takes too long.

Sure, it's faster. But have we checked whether the problem was the car or the six miles of bumper-to-bumper traffic? Language choice matters. Memory safety matters. Runtime performance matters. Coffee matters. But so do maintainability, operational complexity, deployment constraints, and the architecture surrounding the application.

A poorly designed system doesn't become well-designed because you rewrite it in Rust. It just becomes a poorly designed system with a borrow checker. Now it's poorly designed *and* memory safe, so it crashes with dignity.

### So, Is DHH Right?

Maybe. And that's what makes this uncomfortable (for me, at least).

DHH has a long history of challenging conventional software development practices, and he's been right about plenty of things. I don't think dismissing his perspective because it threatens the way we've always worked is particularly productive. But I also don't think the conclusion should be that professional software engineering is becoming obsolete.

I think the economics of implementation are changing faster than the economics of reliability. And that's an important distinction. If AI can generate a million lines of code tomorrow, we haven't necessarily solved software engineering. We've created a million lines of code that need to behave correctly.

The companies that figure out how to build reliable verification systems, realistic testing environments, and effective architectural guardrails around autonomous agents are going to have an enormous advantage. And I suspect the engineers who understand those systems will be incredibly valuable.

Maybe I'm wrong. Maybe five years from now, an AI agent will architect an entire enterprise platform, deploy it flawlessly, optimize the infrastructure, and write a thoughtful Slack message explaining why my services are no longer required, and I should go home, take a shower, and wash the shame off me.

But until then, I think there's still plenty of work to do. Just maybe not the kind of work we've spent the last twenty years preparing for.

AI might be coming for the code. But I'm not convinced it's finished coming for the engineers. And if I'm going to have an existential career crisis, I'd at least like to make sure we're arguing about the right problem.

---

I'm a senior software engineer who's spent over a decade building, breaking, fixing, and architecting software systems. These days, I'm spending a lot of time thinking about where AI fits into that process, and occasionally wondering whether I should've become a doctor.
