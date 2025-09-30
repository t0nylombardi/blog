---
title: 'Let Loose Your Inner Sherlock with a Search Feature'
date: '03-15-2024'
heroImage: '/blog/search-feature/inspector.png'
image: '/blog/search-feature/inspector.png'
originalDatePublished:
description: 'Elevating Your Rails App with a Killer Search Feature'
author: 'Anthony Lombardi'
categories: [ruby, rails]
tags: [search]
draft: false
---

## Searching in Rails

Alright, we're going to dive into the thrilling world of a search feature. Now, let me set the stage here. Picture yourself cruising through a bustling web app, looking for that one needle in a haystack of information. You know what I'm talking about—finding the perfect pair of shoes or hunting down that elusive meme you saw last week. Search functionality is your trusty sidekick in this digital adventure.

How do we bring this magical search feature to life in a Rails app? Well, buckle up because we're about to embark on a journey that'll have you feeling like a modern-day Sherlock Holmes. We'll talk about the nitty-gritty of building a search feature in Rails from the ground up. We'll cover everything from setting up a search method to more advanced features like searching across multiple tables and handling search parameters. By the time we're done, you'll be ready to unleash your inner detective and build a search feature that'll have users feeling like they've got the world at their fingertips.

![Excelsior!](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXJpa3RrdGxwNnEyM3AxdWd6NGZxc2ZjaHhsYjJ0c25nMW9hemFmbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26ufj9ZwxwEaZ8AWk/giphy.gif)

## Implementing a Basic Search Feature

Let's talk about the search method in the controller. This is where the real magic happens. We'll whip up a nifty search method that'll make your app feel like it has its detective on the case. We will use the all-mighty `scaffold` generator to whip up our search feature. When we talk about Rails Scaffold, we're talking about the holy grail of automatic file generation. We're talking controllers, views, models, routes, and migrations - the whole shebang.

Now, to get that ball rolling and scaffold your post, all you have to do is fire off this command:

```bash
rails g scaffold post title body:text
```

And now it's time to bring it all together with a little thing called migration.

```bash
rails db:migrate
```

## Building the Search Form

Once that's done, you're at the central part of the tutorial. So, let's add the form in the `app/views/posts/index.html.erb` file. This is where the magic happens. We're going to sprinkle a little HTML and tailwind magic to make that search bar pop like a fireworks display. And when users type in their queries, they'll be whisked away to a search page that's as sleek and stylish as a red carpet premiere.

Note: I put a lot of the tailwind CSS inside 'application.css,' so it looks like everything is okay in this blog.

```erb
<div class="container flex flex-col">
  <%= form_with url: search_posts_path, method: "get", class: "mt-8" do |f| %>
    <label for="search" class="search-label">Post</label>
    <div class="relative">
      <div class="search-icon">
        <svg class="w-6 h-6 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>
      </div>

      <div data-controller="address">
        <%= f.text_field :search,
                        id: :search,
                        placeholder: "Search Post",
                        class: "search-input" %>

      </div>
      <button id="submit" type="submit" class="search-btn">Search</button>
    </div>
  <% end %>
</div>
```

## Implementing the Search Route

Now, let's talk about the search route in `routes.rb`. Think of this as laying down the tracks for your search feature to zoom through. With just a few lines of code, you'll be paving the way for users to find exactly what they're looking for in no time.

Let's add that search route in `routes.rb`. Think of this as laying down the tracks for your search feature to zoom through. With just a few lines of code, you'll help users find exactly what they're looking for quickly.

```ruby
Rails.application.routes.draw do
  resources :posts do
    collection do
      get :search
    end
  end
end
```

We're using the `collection` method here to add a new route that doesn't require an ID. This is perfect for our search feature because we don't need to worry about specific post IDs when searching for something. We want to cast a wide net and find all the posts that match the user's query.

## Implementing the Search Method

Now, let's talk about the search method in the controller. This is where the real magic happens. We'll whip up a nifty little search method that'll make your app feel like it's got its own personal detective on the case.

**Note**: We are using the turbo_stream to render the search results. This will allow us to update the posts without a full page reload. We'll talk more about this later.

```ruby
def search
  @posts =
    if params[:search].present?
      Post.where('title LIKE ?', "%#{params[:search].downcase}%")
    else
      Post.all
    end

  render turbo_stream:
    turbo_stream.update('posts',
                        partial: 'posts',
                        locals: { posts: @posts })
end
```

Alright, folks, let's break it down like that rusty ole beater in your garage.

- First up, we've got `params[:search]` - that's like your backstage pass from the search bar to the main event. It's passing along whatever you type in that search bar, so make it count!

- Second `.downcase`. This bad boy's like your personal stylist, making sure all your letters are dressed in lowercase threads. Because, let's face it, who needs uppercase drama when you're just trying to find that perfect meme?

- Third, pay attention, 'cause we're getting into the heavy stuff. When I say `Post` with a capital P, I mean the Posts table. That's where all the magic happens, folks.

- Fourth, let's not forget about our good friend, the `%` sign. Stick it at the beginning, and you're opening the floodgates to all the posts that end with whatever letter you throw in there. Toss it at the end, and you're diving headfirst into a pool of posts that start with that same letter. It's like magic but with more databases.

Fifth, onto the real MVP `.where()`. This little powerhouse is our ticket to filtering out all the noise and honing in on exactly what we're looking for. We're talking about searching through columns like a pro, zeroing in on that golden nugget of information.

Last but not least, we've got the big guns `LIKE`. When I say `LIKE` in all caps, I mean business. It's like the matchmaker of the digital world, trying to find that perfect match between what you're searching for and what's hiding in the depths of your database. So when you see `LIKE` you know it's game on, baby!

## Showing the Search Results

Now, let's discuss the search results in the view. This is where the magic happens. We're going to add some HTML and tailwind magic to make those search results look a little more impressive.

```erb
<div class="container flex flex-col">
  <%= form_with url: search_posts_path, method: "get", class: "mt-8" do |f| %>
    .
    .
    .
  <% end %>

  <!--Search Results -->
  <% if @posts.present? %>
    <div class="mt-8">
      <div class="mt-4">
        <%= render 'posts', posts: @posts %>
      </div>
    </div>
  <% end %>
  <!-- Search Results -->
</div>
```

Here, we add a conditional statement to check if the `@posts` variable is present. If so, we loop through each post and display the title and body.

## Adding the Posts Partial with Turbo Streams

`turbo_stream` is a Rails feature that allows you to update parts of a page without a full page reload. It's like having a magic wand that lets you sprinkle fairy dust on your app and make things happen in real-time. When you're in your controller and toss in the `turbo_stream update` method, you're telling your app, "Hey, buddy, when someone hits that submit button, let's fire up that search method, pronto!"

What we are going to do is add a new file called `_posts.html.erb` inside `app/views/posts` and wrap the posts in a `turbo_frame_tag` and update the posts partial with the new posts. This will allow us to update the posts without a full page reload.

```erb
<%= turbo_frame_tag "posts" do %>
  <% posts.each do |post| %>
    <div class="flex items " data-controller="address">
      <div class="flex-1 py-4">
        <h3 class="text-xl font-bold text-white dark:text-gray-100"><%= post.title %></h3>
        <p class="text-gray-400 dark:text-gray-500"><%= post.body %></p>
      </div>
    </div>
  <% end %>
<% end %>
```

## Adding some data to the database

Now, let's add some data to the database. We'll use the file `db/seeds.rb` to do this, which will give us some data to search through. Note that we will use a gem called [faker](https://github.com/faker-ruby/faker) to generate fake data.

```ruby
# frozen_string_literal: true

titles = [
  'Zen and the Art of Not Spilling Your tacos: A Guide to Mindful Eatings',
  'Lucid Dreaming: Because Who Needs Reality Anyway?',
  'The Pursuit of Happiness: A Quest for the Perfect Pizza Topping',
  'Yoga for Couch Potatoes: Mastering the Art of Not Moving'
]

titles.each_with_index do |_v, i|
  Post.create!(
    title: titles[i],
    body: Faker::Lorem.sentence
  )
end
```

Now, let's run the following command to add the data to the database.

```bash
rails db:seed
```

## Conclusion

In conclusion, implementing a compelling search feature in a Rails app is crucial for enhancing user experience and application functionality. By following the steps outlined above, including setting up the search method, designing the search form, defining the search route, and utilizing Turbo Streams for real-time updates, developers can create a search feature that meets and exceeds user expectations. With the right tools and techniques, building a robust search functionality can transform an ordinary Rails app into a user-friendly, dynamic platform that keeps users engaged and satisfied. So, let loose your inner Sherlock and start building a search feature that'll make users feel like they've got the world at their fingertips.
