---
title: "Your tests shouldn't be polite echo chambers"
date: '02-25-2026'
heroImage: '/blog/echo-chamber/echo-chamber.webp'
image: '/blog/echo-chamber/echo-chamber.webp'
originalDatePublished:
description: 'Tests are a critical part of software development, but they can sometimes become polite echo chambers that fail to catch real issues.'
author: 'Anthony Lombardi'
categories: [engineering, testing, software-development]
tags: [ruby, ruby-on-rails, rspec, tdd, testing, clean-code]
draft: false
---

There is a quiet trap that even experienced engineers fall into.

Writing tests that verify what the code does instead of what it is supposed to do. On the surface everything looks amazing. CI is green. Coverage is high. Slack is quiet. You feel powerful. You sip your coffee like someone who has mastered complexity. But sometimes your test suite is not protecting behavior. It is politely rubber stamping whatever your implementation happens to be doing today. That is how you end up with a very polite echo chamber.

Polite echo chambers are dangerous because they clap for you right before production catches fire. There is a difference between writing code to satisfy a test and writing a test to protect a promise. That distinction sounds subtle. It is not. It is the difference between engineering and theater.

Early on it is very easy to slip into this pattern. You write a test. It fails. You tweak the implementation just enough to make it pass. Green check. You push. CI explodes because the environment is slightly different. Or worse, CI passes and production becomes a dumpster fire because your tests never actually modeled real behavior.

Technically you did test driven development. Practically you trained your brain to optimize for green dots instead of correctness. The goal quietly shifts from does this system behave correctly to does this test pass. Those are not the same question.

You can absolutely write a test that passes while not truly verifying intent. Especially in Rails apps with heavy mocking, factory setup, callbacks, scopes, service objects, and all the magic hiding behind the curtain.

![First Diagram](/blog/echo-chamber/code-review-quality.png)

# The Subtle Failure Mode

Imagine you write this method:

```ruby
def total_price(items)
  items.sum(&:price)
end
```

You write a test for it:

```ruby
it "returns the total price" do
  items = [item1, item2]
  expect(total_price(items)).to eq(items.sum(&:price))
end
```

It feels correct. It feels responsible. It feels like something your past self would high five you for. But look at what the test is actually doing. It is repeating the implementation. Your production code says sum the prices. Your test says sum the prices. That is not verification. That is code looking in the mirror and saying, you look great today.

If someone accidentally introduces a bug like:

```ruby
def total_price(items)
  items.sum(&:price) * 2
end
```

Sure. That test probably catches it. But the real danger is subtler.

What happens when the implementation changes in a way that shifts behavior but not structure. Maybe a default scope changes. Maybe rounding logic moved. Maybe a Rails upgrade altered how a query builds under the hood. Your test still passes because it is coupled to how the method works internally, not what the user expects externally.

You are not testing outcomes. You are testing that the code agrees with itself. That is confirmation bias with better syntax highlighting.

## Behavior > Implementation

![First Diagram](/blog/echo-chamber/tddvsbdd.jpg)

The test should answer one simple question: **“What does the system promise to the outside world?”**

Not: **“How does the current implementation happen to achieve it?”**

A better test would be:

```ruby
it "returns the correct total price" do
  item1 = double(price: 10)
  item2 = double(price: 15)

  expect(total_price([item1, item2])).to eq(25)
end
```

Now the behavior is explicit. 25 is the contract. It does not care how you compute it. You can sum, You can map and then sum, You can summon a wizard. As long as the result is 25, the behavior holds. That is what a test suite is supposed to protect. Not the shape of the code. Not the method calls. Not the clever little chain you wrote at 1 AM.

## Danger!, Will Robinson

I have seen this pattern over and over.

- A test stubs out too much.
- A test asserts on the wrong thing.
- A test verifies that a method was called rather than verifying the observable outcome.
- A test uses the same logic as the production code inside the expectation.

So the test passes. But it is not guarding the real contract.

I have spent many late nights and weekends fixing dumpster fires because of this. Those are the tuition payments for learning that green does not mean safe.

There is also a systems level angle here. In large Rails apps subtle changes ripple. A scope changes. A default value changes. A callback order changes. A background job fires twice. If your tests are tightly coupled to structure or heavily mocked they may never notice that outward behavior has drifted. The result is the worst kind of failure. Not an explosion. A slow leak.

Slow leaks are what keep engineers up at night. Or worse. The real growth moment is when you stop asking how do I make this test pass and start asking what would prove this implementation wrong. Good tests are adversarial. They do not cooperate with your implementation. They challenge it. They assume you made a mistake. They try to break it. When you write code just to make the test pass you are optimizing for the test. When you write the test to enforce intent you are optimizing for reality. That is when tests stop being ceremony. That is when they start being armor.

A Rule of Thumb, If your test logic looks suspiciously like your production logic, pause.

Ask yourself: **“If I changed the internal implementation completely, would this test still make sense?”**

If the answer is no, then you’re testing the wrong thing.

Final Thought

Your test suite is supposed to be a safety net. If it’s just an echo of the code, it won’t catch you when you fall.

It’ll just politely agree while you drift into production hell.
