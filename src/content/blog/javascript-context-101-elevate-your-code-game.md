---
title: 'JavaScript Context 101: Elevate Your Code Game'
date: '04-25-2024'
heroImage: '/blog/search-feature/inspector.png'
image: '/blog/search-feature/inspector.png'
originalDatePublished:
description: "Contextual Commando: Conquering JavaScript's Terrain Like a Boss"
author: 'Anthony Lombardi'
categories: [ruby, rails]
tags: [search]
draft: true
---

## Foreword

Today, we're diving into Javascript contexts. Yeah, I know. It sounds about as fun as a colonoscopy without anesthesia. But fear not, because by the time we're done here, you'll be navigating through Javascript contexts like a pro.

So, what's the deal with JavaScript context anyway? Well, think of it as the backstage area of your JavaScript code. It's where all the magic happens before your functions and variables step into the spotlight. And let me tell you, understanding this stuff is crucial if you want to avoid those pesky bugs that can turn your code into a real-life horror show.

But hey, no need to break a sweat just yet. We already know `functions`,` map`, `reduce`, and `forEach` like a boss. So, consider this just another thrilling chapter in our JavaScript saga. And remember, with excellent coding skills comes great responsibility... or something like that. Let's do this!

## Introducing Execution Context

Whenever your JavaScript code hits the stage, the JavaScript engine sets up its backstage crew. We're talking about memory here, folks. It carves out a little space to keep track of all the variables and functions you've got going on. Then there's the VIP section. That's what we call the global execution context. It's where the big shots hang out, the ones that are defined at the tip-top level of your code.

Now, when a function gets called to action, it's like opening up a whole new set. We're talking about the function execution context. It's like a cozy little corner where your function can do its thing, with all the variables and functions it needs close at hand.

But here's where it gets interesting. Functions aren't just limited to their own little world. Oh no, they've got connections. They can reach out and tap into the execution contexts of their parents. So, not only do they have their own little party going on, but they can also crash the party in the global context or any function they're nested in. It's like having access to the entire guest list.

And why does any of this matter? Well, think of execution context as the backstage pass JavaScript uses to keep track of who's who and what's what. It's how it knows where to find the variables, what methods are up for grabs, and all that jazz. So yeah, it might sound a bit complicated now, but trust me, once you see it in action, it'll all start to make sense.

Let's lay the groundwork for our JavaScript journey with five key terms that'll be your trusty sidekicks. Consider this the pre-game pep talk, so when these terms pop up later, you'll be like, "Ah-ha, I've been expecting you!"
Execution Context: Picture this as the backstage pass to JavaScript's memory. It's where all the cool kids—variables and methods—hang out, depending on where your code is running. At the global level, it's the global execution context. But inside a function, it's a whole new vibe, blending the function's execution context with its parent scopes. It's like a VIP room where everyone's connected.

- `this`: This one's a bit of a mystery. It's a unique object that's part of the current execution context. But here's the kicker: its value changes based on where and how a function is called. Confused? Don't worry; we'll untangle this web of `this` in the upcoming lessons.
- `call`: Think of this as the hotline bling for your function. When you dial `call`, you're essentially saying, "Hey, function, wake up! And oh, here's the object you should consider as `this` when you do your thing." Plus, you can throw in some extra arguments for good measure. It's like giving your function a personalized wake-up call.
- `apply` is similar to `call` but with a twist. It's like saying, "Hey, function, time to shine! And by the way, here's the object you should treat as `this` when you do your magic." But instead of listing arguments one by one, you bundle them neatly in an array—efficiency at its finest.
- `bind`: Last but not least, we've got `bind`—this one's like cloning your function but with a new identity. You're saying, "Hey, function, I want to prep you for a new environment. So, when you're called, make sure 'this' is set to this specific object." It's like giving your function a makeover for a special occasion.

If your brain feels a bit like mashed potatoes right now, don't sweat it. We'll be diving deep into these concepts soon. But before we do, let's warm up those coding muscles by putting what we've learned into action.

For this tutorial, we're cooking up something special: a time card application. Now, bear with me because this isn't your run-of-the-mill app. We're talking about a "record-oriented" masterpiece here. It's all about processing those employee time cards like a well-oiled machine.

Once our application is up and running, the real fun begins. We'll sprinkle some execution context, 'this', call, apply, and bind magic on our code. Trust me, it's like adding a secret ingredient that makes everything smoother and tastier.

## Deciphering the Code: What Exactly is a 'Record'?

Way, way...way back in the day, before iPhones and TikTok took over the world, computers were a whole different breed. We're talking about the swinging 60s and even earlier, when memory was scarcer than a decent cup of coffee on a Monday morning.

Hold onto your hats because this is where it gets wild. Records weren't just ones and zeros floating around in the digital ether back then. Oh no, they were tangible, physical things. Imagine that! We're talking about good ol' punch cards, folks. Yeah, you heard me right. These little squares of paper packed a punch, quite literally.

Take a gander at this beauty:

![Old School Punch Card](/blog/javascript-context/punch-card.png)

Now, these cards weren't just for show. Oh no, they were packed with juicy details, neatly organized into what we call "fields." You've got your `first_name` field, your `last_name field`, and even a field for how many hours you slaved away at the office.

So, when payday rolled around, here's how the magic happened:

- Step 1: Load up all those punch cards into a tray, like you're loading bullets into a gun. It's about to get real.
- Step 2: Feed that tray into the belly of the beast—the computer. It's hungry for data; those punch cards are its favorite snack.
- Step 3: The computer goes to work, reading through each card, crunching numbers faster than you can say, "Bob's your mother's brother." It's like a digital Sherlock Holmes, solving the mystery of how many hours each employee put in...Or didn't
- Step 4: Hot off the press pops a shiny new card. But this isn't your grandma's punch card. No, sir, this one's got a unique field added, letting you know exactly how much dough each employee is owed. It's like winning the lottery but with less screaming and more numbers.
- Step 5: And just for good measure, the computer spits out a neat little table, listing all the employees' names and the fat stacks they're about to cash in. It's payday, baby!
- Step: 6 ...
- Step: 7 Profit.

> ASIDE: Come to think of it, iterating over a collection, performing a transformation, and emitting a new collection where every element has been transformed sounds an *awful* lot like `map` to us.

So, it's time for a little analog action after our trusty computer does its thing and churns out the pay ledger. Picture this: strolling down to the payroll department, the ledger in hand, ready to write those checks the old-fashioned way—with pens and ink! There is none of that digital transfer nonsense here. It's all about the satisfying scratch of pen on paper, the faint scent of ink lingering in the air. But wait, there's more! When the bigwigs in the executive suite want to peek at the company's payroll costs, it's back to the punch cards we go. Load 'em up, run 'em through a different program, and boom!

> ASIDE: Come to think of it, iterating over a collection, performing an evaluation on each element and emitting a new value based on those elements sounds an awful lot like `reduce` to us.

## The Big Kahuna: Execution Context

Let's peel back the curtain on how JavaScript handles functions. So, every time you call a function, JavaScript springs into action, creating what we call a 'function execution context.' It's like setting the stage for the star of the show—the function itself. And right there in the spotlight is this little object, quietly waiting to be acknowledged. We call it `this`, the key player in our JavaScript drama.

Now, here's where things get interesting. We can play matchmaker with `this` by using nifty methods like call, apply, or bind. It's like saying, "Hey, function, meet your new best friend!" And just like that, we explicitly pass along the object we want 'this' to refer to. Pretty neat?

But what happens if we don't play matchmaker? How does JavaScript know which object to pass along? Well, that's where the magic of JavaScript's rules comes into play. It's like a secret code, hidden in plain sight. JavaScript works its mojo and figures out the perfect object to pass along depending on how and where the function is called. It's like watching a master detective solve a case, one function call at a time.

## How JavaScript Implicitly Sets Execution Context

JavaScript does the heavy lifting when passing around `this` Most of the time, we're in luck—we don't need to play matchmaker with `call`, `apply`, or `bind`. Instead, we sit back and let JavaScript work its magic, figuring out 'this' all on its own. Don't get too comfy just yet. It's crucial to wrap our heads around how JavaScript pulls off this sleight of hand.

Now, picture this: we've got two scenarios to mull over. First, we've got your "bare" function calls—no frills, no fuss. It's like throwing a dart blindfolded and hoping for a bullseye. But fear not because JavaScript has a trick up its sleeve for handling these situations. Then, we've got calling a function expression that's cozying up as a property of an object. It's like inviting your favorite celebrity over for dinner and hoping they overlook the burnt lasagna. But don't worry, JavaScript's got our back here, too.

## The Execution Context of Methods



