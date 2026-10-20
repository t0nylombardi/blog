---
title: "Congratulations, You've Built a Distributed Monolith"
date: '10-20-2026'
heroImage: '/blog/distributed-microservices/distributed-monoliths.webp'
image:  '/blog/distributed-microservices/distributed-monoliths_thumb.webp'
originalDatePublished:
description: "Microservices didn't fail you. Your boundaries did."
author: 'Anthony Lombardi'
categories: [microservices, software-architecture, domain-driven-design]
tags: [microservices, monoliths, distributed-systems, ddd, bounded-contexts, scalability, software-design, team-autonomy]
draft: true
---

Somewhere along the way, microservices became the villain of modern software architecture. Every few months, another engineer publishes an article explaining how their company abandoned microservices, returned to a monolith, and discovered that life was suddenly wonderful again. Fewer deployments, less infrastructure, fewer network calls, and fewer headaches. Congratulations, I guess. But I can't help wondering whether microservices were actually the problem or whether the architecture was poorly designed from the beginning.

I've spent enough time working with large applications and engineering teams to know that monoliths aren't the magical simplicity machines people sometimes make them out to be. I've also seen microservices go horribly wrong. Services that started with a clear purpose slowly accumulated responsibilities until their APIs became sprawling collections of unrelated endpoints. What was supposed to be a small, independently deployable component eventually turned into its own monolith, only now it communicated over HTTP.

That's not an argument against microservices. That's an argument against ignoring architectural boundaries.

I'm an advocate for microservices, particularly when they're designed around Domain-Driven Design (DDD). I believe services should represent meaningful business capabilities, teams should be able to deploy independently, and applications should scale according to the demands of their individual components. I also believe that forcing a large engineering organization into a single codebase and deployment pipeline introduces costs that rarely appear in those glowing articles about returning to monolithic architecture.

So before we jump on the latest architectural bandwagon, declare microservices a failed experiment, and celebrate the triumphant return of the monolith, let's talk about what actually goes wrong.

## Your Monolith Isn't as Cheap as You Think

One of the most common arguments in favor of monoliths is that they're cheaper to operate. And from a purely infrastructural perspective, that can absolutely be true. A single application is generally easier to deploy, monitor, and maintain than a collection of distributed services. You don't necessarily need service discovery, message brokers, complex networking configurations, or the additional observability required to trace requests across multiple applications.

But infrastructure isn't the only expense involved in building software. Engineers cost money, too. So does lost productivity, delayed releases, deployment coordination, and the time spent untangling changes that have absolutely nothing to do with one another.

During my time at one company (let's not name names), I saw firsthand what happens when a large engineering organization works within a shared codebase. Multiple engineers and teams are constantly pushing changes, each working on different features, fixing different bugs, and trying to meet different deadlines. The volume of commits alone creates challenges, but the real problems become apparent when something breaks.

Imagine spending several days building and testing a feature, only to discover that another team's changes have introduced a problem that prevents the application from being released. Your code works. Your tests pass. Your feature is ready. Unfortunately, none of that matters because everyone shares the same deployment unit.

Now the team needs to investigate the failure, identify the offending changes, determine whether a rollback is safe, and coordinate a resolution. Meanwhile, other engineers continue contributing code, potentially introducing additional changes into an already complicated situation.

And we're calling this simpler?

![homer backing into a bush](/blog/distributed-microservices/homer-bush.gif)

Sure, there's only one application to deploy. But there's also only one application that everyone depends on deploying successfully.

The operational cost of a monolith might be lower, but the organizational cost can become enormous as the engineering team grows. At some point, the question stops being how much money you're saving on infrastructure and becomes how much productivity you're sacrificing to maintain a shared release process.

## One Codebase, One Deployment, Everyone's Problem

I hear people say that monoliths are easier to deploy, and I generally agree. Deploying one application is easier than deploying twenty. The problem is that deployment simplicity doesn't automatically translate into development agility.

When multiple teams contribute to a single application, the release process can become a coordination exercise. One team's feature might require a database migration. Another team's changes might introduce a regression. Someone else might need to revert a commit, but doing so risks interfering with code that was merged afterward.

Suddenly, a deployment isn't simply a matter of shipping completed work. It's a matter of making sure everyone else's work is ready to ship, too.

This becomes particularly frustrating when teams operate on different priorities and timelines. Why should a team working on payment processing have to wait for a bug in a reporting feature to be resolved before deploying an unrelated improvement? Why should an issue in one part of the business prevent another team from delivering value?

Yes, feature flags can help. So can trunk-based development, automated testing, and sophisticated CI/CD pipelines. A well-engineered monolith can absolutely support continuous delivery. But those practices don't eliminate the fundamental reality that the application remains a shared deployment unit.

And before someone tells me that their company deploys a monolith fifty times a day, great! I'm glad it works for you. That doesn't mean the same architecture is appropriate for an organization with dozens of teams working across different business domains.

Agile development is supposed to encourage small, incremental changes, rapid feedback, and the ability to respond quickly. When teams must constantly coordinate releases around unrelated changes, that starts to feel suspiciously like the kind of dependency-heavy development process Agile was supposed to improve.

I'm not saying a monolith automatically turns your organization into a waterfall shop. I'm saying that when your release process depends on everyone moving together, you should probably question how independently your teams can actually operate.

## Microservices Are About Boundaries, Not Endpoints

This is where I think a lot of microservice implementations go wrong.

Someone decides the application has become too large, so the engineering team starts breaking it apart. They extract a few controllers, move some business logic into a separate repository, expose a REST API, and congratulate themselves on their shiny new microservice architecture.

Except moving code into another repository doesn't automatically create a meaningful service boundary.

A microservice should represent a specific business capability. This is one of the reasons I'm such a strong advocate for Domain-Driven Design. DDD encourages engineers to understand the business domain, identify bounded contexts, and model software around the language and responsibilities of the business itself.

Consider a lending platform. Loan origination, underwriting, payments, and notifications represent different business capabilities. They have different responsibilities, different workflows, and potentially very different scaling requirements.

Those boundaries can provide a foundation for independently owned services. The underwriting service shouldn't become responsible for sending marketing emails simply because it already has access to customer information. The payments service shouldn't absorb unrelated reporting workflows because someone decided it would be convenient.

And a service shouldn't need to understand the internal database structure of another service to perform its own responsibilities.

This is also where an important distinction needs to be made: DDD doesn't require microservices. You can absolutely implement bounded contexts within a modular monolith. In fact, understanding those boundaries before introducing distributed infrastructure is often a sensible approach.

But microservices allow you to take those boundaries further. They can become boundaries for deployment, scaling, ownership, and operational responsibility, not merely organizational boundaries within a codebase.

That's the value I'm interested in.

## Congratulations, You've Built Another Monolith

![a monolith](/blog/distributed-microservices/monolith.png)

Now let's talk about the other side of the problem, because I've seen microservices become a mess, too.

It usually starts innocently enough. A team creates a service responsible for a particular domain. The API is small, the responsibilities are clear, and everything works beautifully.

Then someone needs another endpoint. No problem. A few weeks later, another feature requires some additional functionality. That gets added, too. Eventually, another team realizes the service already has access to information they need, so they ask for an endpoint that doesn't quite belong there.

Before long, the service has become the convenient place to put anything remotely related to its original purpose.

Its API keeps growing. Its dependencies multiply. Its database accumulates tables that have little to do with the original domain. Changes become harder to reason about, and the team responsible for maintaining it becomes a bottleneck for everyone consuming it.

Sound familiar?

Congratulations. You've built another monolith.

Only this time, you've given it a network connection.

This is the part that frustrates me when people use failed microservice implementations as proof that microservices are inherently flawed. If a service becomes a dumping ground for unrelated business logic, the problem isn't that the service exists independently. The problem is that its boundaries were never properly established or maintained.

And there's another variation that's arguably worse: splitting an application into multiple services that remain so tightly coupled they must be changed and deployed together.

If updating one service requires coordinated changes across six others, and none of them can be deployed independently, what exactly did you gain by separating them?

You've taken the coupling of a monolith and added network latency, distributed failure modes, and more infrastructure to manage. That's a distributed monolith in the architectural sense, regardless of how many repositories or Kubernetes pods you've created.

The answer isn't necessarily to shove everything back into one application. The answer is to understand why those services are coupled and whether their boundaries reflect the actual business domain.

Sometimes responsibilities need to be moved. Sometimes services need to be split. Sometimes two services that are constantly changing together should actually be one. Good architecture requires revisiting these decisions as the business evolves.

A microservice isn't successful simply because it's small. It's successful because it has a cohesive responsibility and can evolve without forcing unrelated parts of the system to evolve alongside it.

## Scaling Everything Because One Thing Is Busy

Let's talk about scaling, because this is another area where I believe microservices offer significant advantages.

A monolith can scale. Of course it can. Anyone claiming otherwise is ignoring decades of successful applications running behind load balancers with multiple instances. Horizontal scaling isn't exclusive to microservices, and a well-designed monolith can handle substantial traffic.

But being able to scale something and being able to scale it efficiently are two different things.

Imagine an application responsible for authentication, customer management, reporting, document processing, and transaction processing. Most of those components experience relatively predictable traffic, but document processing occasionally consumes substantial CPU and memory.

With a conventional monolithic deployment, scaling that workload might require running additional instances of the entire application. You're allocating resources to components that don't necessarily need them because one part of the system is under pressure.

With independently deployed microservices, you can scale the document-processing service according to its actual demand without scaling authentication, reporting, or customer management alongside it.

That's a meaningful advantage.

It's also worth acknowledging that monoliths can mitigate this problem through background workers, separate process types, and workload-specific deployment configurations. But once you're separating workloads operationally, you're already recognizing that different parts of the application have different resource requirements.

Microservices take that separation further by allowing individual business capabilities to have their own runtime configurations, resource allocations, scaling policies, and deployment lifecycles.

Of course, this doesn't automatically make microservices cheaper. Running distributed infrastructure introduces costs, and a poorly designed architecture can spend more money on network communication and orchestration than it saves through targeted scaling.

But at sufficient scale, particularly when workloads vary significantly, the ability to allocate resources precisely where they're needed can become extremely valuable.

The point isn't that monoliths can't scale. It's that scaling a monolith often gives you less control over what you're scaling.

## Your Team Shouldn't Need Permission to Deploy

One of the biggest benefits of microservices has very little to do with technology.

It's team autonomy.

When services are designed around meaningful business domains and owned by teams that understand those domains, engineers can make changes without constantly coordinating with everyone else in the organization.

A team responsible for loan origination should be able to improve its service, run its tests, and deploy its changes without waiting for the reporting team to finish an unrelated feature. A team responsible for notifications should be able to address a production issue without requiring a full application release.

That's what independent deployment is supposed to accomplish.

It doesn't mean teams never communicate. Shared contracts, business workflows, and cross-domain changes still require coordination. Microservices don't magically eliminate organizational dependencies.

But they can reduce unnecessary ones.

And this is where architecture and team structure become closely related. If every service is owned by a different team but every change requires approval from five other teams, you haven't achieved autonomy. You've simply distributed the bureaucracy.

Similarly, if one team owns twenty services and becomes responsible for implementing every feature requested by the rest of the organization, you've created a bottleneck with a collection of smaller applications.

Service ownership needs to align with the responsibilities and capabilities of the teams maintaining them. Otherwise, the architecture might look distributed while the organization continues operating as though everything belongs to one giant application.

To me, this is one of the strongest arguments for combining microservices with DDD. You're not arbitrarily dividing code. You're defining boundaries that make sense both technically and organizationally.

And when those boundaries are right, teams can move faster without constantly getting in one another's way.

## Microservices Aren't an Excuse to Ignore Engineering Discipline

None of this means microservices are easy.

Distributed systems introduce challenges that simply don't exist, or exist differently, inside a single application. Network calls fail. Messages arrive late or more than once. Services become temporarily unavailable. Transactions that were straightforward inside one database suddenly require careful consideration of consistency and failure recovery.

Observability becomes essential because debugging a request that passes through multiple services is considerably more complicated than following a stack trace through one application.

API contracts need to be maintained. Backward compatibility matters. Deployment automation becomes more important, not less. And if teams aren't disciplined about ownership and boundaries, the architecture can deteriorate surprisingly quickly.

That's the trade-off.

But complexity doesn't disappear just because you choose a monolith. It shows up in different places. Instead of distributed tracing, you might be dealing with an increasingly tangled dependency graph. Instead of coordinating API contracts, you might be coordinating changes to shared models and database tables. Instead of managing multiple deployment pipelines, you might be managing one pipeline that every team depends on.

The question isn't which architecture has zero complexity. Neither does.

The question is which complexity you're willing to manage and what you get in return.

For a small application maintained by a handful of engineers, introducing ten microservices might be an absurd decision. The operational overhead could easily outweigh any benefits.

But for a large organization with distinct business domains, substantial workloads, and multiple engineering teams trying to deliver independently, I believe microservices can provide a much better foundation.

That belief comes with a condition: you have to design them properly.

A service needs a clear purpose. Its data ownership should be explicit. Its API should expose capabilities rather than leak internal implementation details. Its dependencies should be intentional, and the team maintaining it should be willing to challenge new responsibilities that don't belong within its domain.

Most importantly, engineers need to understand that architecture isn't finished when the initial migration is complete.

Business requirements change. Domains evolve. Boundaries that made sense two years ago might not make sense today. Maintaining a healthy microservice architecture means continuously evaluating those boundaries instead of treating every service as a permanent fixture.

## Stop Blaming Microservices for Bad Architecture

I'm not interested in arguing that every application should use microservices. That would be just as ridiculous as arguing that every application should be a monolith.

What bothers me is the tendency to treat failed microservice implementations as evidence that the architectural approach itself is fundamentally broken.

If your services share one giant database, require coordinated deployments, expose endless collections of unrelated endpoints, and can't operate without making synchronous calls to half the organization, then yes, you've probably built a distributed monolith.

But that isn't the architecture I'm advocating.

I want services built around clearly defined business capabilities. I want engineering teams to own their domains, deploy independently, and scale their workloads without dragging the rest of the application along for the ride. I want boundaries that reduce coupling rather than simply hiding it behind an API.

And I don't want one team's broken feature to become every other team's deployment problem.

Monoliths have their place. They can be effective, maintainable, and perfectly appropriate for many applications. But as engineering organizations grow, the coordination costs of a shared codebase and deployment process deserve just as much attention as the infrastructure costs of running distributed services.

A monolith isn't automatically simpler just because it lives in one repository. And microservices aren't automatically better just because they live in twenty.

Good architecture is about understanding the business, establishing meaningful boundaries, and giving engineers the ability to change software without unnecessarily disrupting everyone else.

So if you've spent the last year breaking your monolith into services, only to discover that deployments still require a company-wide meeting and every feature touches six different APIs, I have some unfortunate news.

Congratulations. You've built a distributed monolith.

**But don't blame microservices. Blame the boundaries you forgot to respect.**
