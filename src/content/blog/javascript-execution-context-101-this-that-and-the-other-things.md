---
title: 'Javascript Execution Context 101: This, that, and the other things'
date: '04-25-2024'
heroImage: '/blog/javascript-context/code-unsplash.jpg'
image: '/blog/javascript-context/code-unsplash.jpg'
originalDatePublished:
description: "Learn how to use this, call, apply, and bind like a Asgardian hammer-wielding mofo."
author: 'Anthony Lombardi'
categories: [javascript]
tags: [javascript, context]
draft: false
---

Today, we're exploring Javascript execution contexts. Yeah, I know. It sounds about as fun as a colonoscopy without anesthesia. But fear not, because by the time we're done here, you'll be navigating through Javascript contexts like a pro. I'm assuming you already know `functions`,` map`, `reduce`, and `forEach`. So, consider this just another thrilling chapter in our Javascript saga. And remember, with excellent coding skills comes great responsibility... or something like that. Let's do this!

## Introducing Execution Context

Whenever your Javascript code hits the stage, the Javascript engine sets up its backstage crew. It carves out a little space to keep track of all the variables and functions you've got going on. Then there's the VIP section. That's what we call the global execution context. It's where the big shots hang out, the ones that are defined at the tip-top level of your code.

Now, when a function gets called to action, it's like opening up a whole new set. We're talking about the function execution context. It's like a cozy little corner where your function can do its thing, with all the variables and functions it needs close at hand.

But here's where it gets interesting. Functions aren't just limited to their own little world. Oh no, they've got connections. They can reach out and tap into the execution contexts of their parents. So, not only do they have their own little party going on, but they can also crash the party in the global context or any function they're nested in. It's like having access to the entire guest list.

And why does any of this matter? Well, think of execution context as the insider access Javascript uses to keep track of who's who and what's what. It's how it knows where to find the variables, what methods are up for grabs, and all that jazz. So yeah, it might sound a bit complicated now, but trust me, once you see it in action, it'll all start to make sense.

Let's lay the groundwork for our Javascript journey with five key terms that'll be your trusty sidekicks. Consider this the pre-game pep talk, so when these terms pop up later, you'll be like, "Ah-ha, I've been expecting you!" Execution Context: At the global level, it's the global execution context. But inside a function, it's a whole new vibe, blending the function's execution context with its parent scopes.

- `this`: This one's a bit of a mystery. It's a unique object that's part of the current execution context. But here's the kicker: its value changes based on where and how a function is called. Confused? Don't worry; we'll untangle this web of `this` in the upcoming lessons.
- `call`: Think of this as the hotline bling for your function. When you dial `call`, you're essentially saying, "Hey, function, wake up! And oh, here's the object you should consider as `this` when you do your thing." Plus, you can throw in some extra arguments for good measure. It's like giving your function a personalized wake-up call.
- `apply` is similar to `call` but with a twist. It's like saying, "Hey, function, time to shine! And by the way, here's the object you should treat as `this` when you do your magic." But instead of listing arguments one by one, you bundle them neatly in an array—efficiency at its finest.
- `bind`: Last but not least, we've got `bind`—this one's like cloning your function but with a new identity. You're saying, "Hey, function, I want to prep you for a new environment. So, when you're called, make sure 'this' is set to this specific object." It's like giving your function a makeover for a special occasion.

## Deciphering the Code: What Exactly is a 'Record'?

Way, way...way back in the day, before TikTok, iPhones, TRL, and The World Wide Web took over the world, computers were a whole different breed. We're talking about the swinging 60s and even earlier, when memory was scarcer than a decent [cup of coffee](https://www.buymeacoffee.com/t0nylombardi) on a Monday morning.

Hold onto your hats because this is where it gets wild. Records weren't just ones and zeros floating around in the digital ether back then. Oh no, they were tangible, physical things. Imagine that! We're talking about good ol' punch cards. Yeah, you heard me right. Little squares of paper packed a punch, quite literally.

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

So, it's time for a little analog action after our trusty computer does its thing and churns out the pay ledger. Imagine: strolling down to the payroll department, the ledger in hand, ready to write those checks the old-fashioned way—with pens and ink! There is none of that digital transfer nonsense here. It's all about the satisfying scratch of pen on paper, the faint scent of ink lingering in the air. But wait, there's more! When the bigwigs in the executive suite want to peek at the company's payroll costs, it's back to the punch cards we go. Load 'em up, run 'em through a different program, and boom!

> ASIDE: Come to think of it, iterating over a collection, performing an evaluation on each element and emitting a new value based on those elements sounds an awful lot like `reduce` to us.

![The Big Kahuna](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3lqZWh4eDE0a2EwMzllcGk1Nnl6aXg3N2R6NXZxdmo3ZHZnM2g4NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oz8xXUXODTG49GGaI/giphy.gif)

## The Big Kahuna: Execution Context

Let's peel back the curtain on how Javascript handles functions. So, every time you call a function, Javascript springs into action, creating what we call a 'function execution context.' It's like setting the stage for the star of the show—the function itself. And right there in the spotlight is this little object, quietly waiting to be acknowledged. We call it `this`, the key player in our Javascript drama.

Now, here's where things get interesting. We can play matchmaker with `this` by using nifty methods like call, apply, or bind. It's like saying, "Hey, function, meet your new best friend!" And just like that, we explicitly pass along the object we want 'this' to refer to. Pretty neat?

But what happens if we don't play matchmaker? How does Javascript know which object to pass along? Well, that's where the magic of Javascript's rules comes into play. It's like a secret code, hidden in plain sight. Javascript works its mojo and figures out the perfect object to pass along depending on how and where the function is called. It's like watching a master detective solve a case, one function call at a time.

## How Javascript Implicitly Sets Execution Context

Javascript does the heavy lifting when passing around `this` Most of the time, we're in luck—we don't need to play matchmaker with `call`, `apply`, or `bind`. Instead, we sit back and let Javascript work its magic, figuring out 'this' all on its own. Don't get too comfy just yet. It's crucial to wrap our heads around how Javascript pulls off this sleight of hand.

Now, we've got two scenarios to mull over. First, we've got your "bare" function calls—no frills, no fuss. It's like throwing a dart blindfolded and hoping for a bullseye. But fear not because Javascript has a trick up its sleeve for handling these situations. Then, we've got calling a function expression that's cozying up as a property of an object. It's like inviting your favorite celebrity over for dinner and hoping they overlook the burnt lasagna. But don't worry, Javascript's got our back here, too.

## How to Override Context Like a Asgardian Hammer-wielding Mofo with *call* and *apply*

![Thor](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExenZxN2tubjlvYnNyY2s2ZGN1MGd5Y2Z5bXB3dDh4MXdibGlkNG1pOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1Nclw5CJ3N77G/giphy.gif)

Now that I chewed your ear off, `call` and `apply` are more than just methods on functions—they're like the secret sauce that gives us ultimate control. Let me paint a picture for you. If you have a function and want to shake things up a bit, maybe switch up the context object. Well, that's where `call` and `apply` swoop in to save the day. Remember when we talked about punch cards? Ah, good times. Now, imagine invoking those functions like we always do, but with a twist. We'll throw in some `call` or `apply` action and watch the magic unfold. It's like adding a pinch of spice to an already delicious dish—the same great taste, but with an extra kick.

```javascript
const asgardianBrothers = [
  {
    firstName: "Thor",
    familyName: "Odinsson"
  },
  {
    firstName: "Loki",
    familyName: "Laufeysson-Odinsson"
  }
]

function intro(person, line) {
  return `${person.firstName} ${person.familyName} says: ${line}`
}

const phrase = "I like this brown drink very much, bring me another!"
intro(asgardianBrothers[0], phrase) //=> Thor Odinsson says: I like this brown drink very much, bring me another!
```

What if we told Javascript that instead of the record being a parameter, it could be assumed as a context and thus accessible via `this`. To accomplish this, we can use either `call` or `apply`:

```javascript
function introWithContext(line){
  return `${this.firstName} ${this.familyName} says: ${line}`
}

introWithContext.call(asgardianBrothers[0], phrase) //=> Thor Odinsson says: I like this brown drink very much, bring me another!

introWithContext.apply(asgardianBrothers[0], [phrase]) //=> Thor Odinsson says: I like this brown drink very much, bring me another!
```

Alright, let's break `this` down like a septic tank after Taco Tuesday. So, we've got this `introWithContext` function. It's like the sidekick to our primary intro function, but with a twist. Instead of taking a bunch of arguments, introWithContext needs one thing: a catchphrase. Simple enough, huh? But here's where things get interesting. We can take `introWithContext` for a spin and use either `call` or `apply` to shake things up. We toss in `thisArg` object as the first argument, and bam! Suddenly, that object becomes the star of the show inside the function. It's like passing the Olympic torch to a new hero.

Now, let's talk about the nitty-gritty. When it comes to using `call` or `apply`, the game plan is pretty much the same. You've got your function, you've got your `thisArg` object, and you've got your catchphrase. The only difference? How you pass along any additional arguments. With call, it's like throwing a handful of confetti—each argument gets its own spotlight, listed out one by one after the `thisArg`. It's like a party, and everyone's invited. But with `apply`, it's a bit more laid-back. You bundle up those extra arguments in an array, and boom! They get passed along just like that. It's like tossing a whole pizza into the mix and watching everyone dig in.

```javascript
intro(asgardianBrothers[0], phrase) === introWithContext.call(asgardianBrothers[0], phrase) //=> true
intro(asgardianBrothers[0], phrase) === introWithContext.apply(asgardianBrothers[0], [phrase]) //=> true

const complaint = "I was falling for thirty minutes!"
intro(asgardianBrothers[1], complaint) === introWithContext.call(asgardianBrothers[1], complaint) //=> true
intro(asgardianBrothers[1], complaint) === introWithContext.apply(asgardianBrothers[1], [complaint]) //=> true
```

## Explicitly Lock Context For a Function With bind

Alright, let's get all hypothetical for a moment. Lets say you've got your `introWithContext` function. It's like the show's star, but sometimes you want to lock it in and stick it to one spot like glue. Let's say we want to clone `this` function, but with a twist—where the context is locked in tighter than a celebrity's NDA. That's where bind comes swooping in, like a superhero with a cape made of Javascript code.

```javascript
const asgardianBrothers = [
  {
    firstName: "Thor",
    familyName: "Odinsson"
  },
  {
    firstName: "Loki",
    familyName: "Laufeysson-Odinsson"
  }
]
function introWithContext(line){
  return `${this.firstName} ${this.familyName} says: ${line}`
}

const thorIntro = introWithContext.bind(asgardianBrothers[0])
thorIntro("Hi, Jane") //=> Thor Odinsson says: Hi, Jane
thorIntro("I love snakes") //=> Thor Odinsson says: I love snakes
```

We call the bind method on a function (`introWithContext` in this case) and pass one argument: the object we want to be bound to the function. The `bind` method returns a new function that needs to be called, which we've saved into the variable `thorIntro`. Then, when we call thorIntro, any `this` references inside the original function that bind was called on are "hard set" to `asgardianBrothers[0]`.

## Conclusion

To sum up the explicit overrides:

- The context object can be explicitly set in a function by invoking `call` on the function and passing an object (`thisArg`) as the first argument; the object can then be accessed via `this` inside the function. Additional parameters to the function are listed after `thisArg`.
- The context object can be explicitly set in a function by invoking `apply` on the function and passing an object (`thisArg`) as the first argument; the object can then be accessed via `this` inside the function. Additional parameters to the function are stored in an array which is passed as the second argument.
- The context object can be locked in a function by invoking `bind` on the function and passing it a `thisArg`. The `bind` function makes a copy of the functionality of the function it was called on, but with all the `this` stuff locked in place, and returns that function. That new function can have arguments passed to it with `()` as usual.
