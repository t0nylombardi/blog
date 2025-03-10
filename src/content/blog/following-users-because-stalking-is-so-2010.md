---
title: 'Following Users: Because Stalking is so 2010'
date: '03-02-2024'
heroImage: '/blog/follow-unfollow/follow-users.jpeg'
image: '/blog/follow-unfollow/follow-users.jpeg'
originalDatePublished:
description: 'Adding Some Social Stalking Flair with follow/unfollow users'
author: 'Anthony Lombardi'
categories: [ruby, rails]
tags: [ruby, social network]
draft: false
---

In the world of social networking, being able to keep tabs on your friends, favorite influencers, and the occasional ex is practically an Olympic sport. So why not embrace it and learn how to implement follow/unfollow functionality in your Ruby on Rails app? Let's dive into the wonderfully creepy world of user stalking and build something truly captivating.

### Modeling User Relationships: It's Complicated (Like All Good Relationships)

So you want users to follow each other, huh? Sounds simple enough, but buckle up, because it's about to get as complicated as a Facebook relationship status. We'll start by trying to model it with a `has_many` relationship, but surprise, surprise, it's not that easy. Turns out, we need a little more finesse to make this work without creating a data model mess.

Alright, so picture this: you're diving headfirst into the wild world of user stalking... uh, I mean, following. At first glance, you might think, "Hey, I'll just slap a `has_many` relationship on there and call it a day." But hold your horses, because this ain't your grandma's social network. Turns out, there's a twist in the tale, and we're about to embark on a journey through the mystical land of `has_many :through.` It's like discovering that the secret ingredient in grandma's famous cookies is actually unicorn tears. Intrigued? Let's dive in and uncover the magic behind building a data model that'll make even Dumbledore raise an eyebrow.

Imagine you're strolling through the digital streets of your favorite social platform. You've got Morty, your average... piece of defication, just minding his own business. Then there's Rick, the cool cat everyone wants to hang with. Now, Morty decides he wants to be part of Rick's entourage, so he hits that follow button faster than you can say "wubba lubba dub dub." Boom! Morty's now a follower, and Rick? Well, he's officially _followed_ by Morty.

Now, let's talk about labels. You see, in the world of Rails, everything's gotta have a label. So, naturally, Morty's got himself a sweet array of followers, because who wouldn't want to follow the guy who's pals with _the_ Rick, right? But here's where things get a bit wonky. By default, Rails wants to call the folks Morty's following the _followeds_. Yeah, try saying that three times fast without tripping over your own tongue. We're not about that life. So, we're taking a page out of X(formally know as Twitter)'s playbook. X might not be perfect(let's face it, it's a dumpster fire), but they got one thing right: calling them "followeds" just sounds wrong. We'll adopt their convention and stick with "following" for those you're stalking and "followers" for your loyal fans.

This discussion suggests modeling the followed users, with a `following` table and a `has_many` association. Since `user.following` should be a collection of users, each row of the `following` table would need to be a user, as identified by the `followed_id`, together with the follower_id to establish the association. In addition, since each row is a user, we would need to include the user’s other attributes, including the name, email, password, etc.

For simplicity, we omit the following table’s id column.

![First Diagram](/blog/follow-unfollow/first_diagram.png)

Alright, let's talk about being DRY. You know, that feeling you get when you realize you've got the same info stored in three different places? Yeah, not so ideal. Our data model is suffering from a severe case of redundancy. Each row in our `following` table not only contains the followed user's ID but also a whole bunch of other info that's already chilling in the `users` table. And don't even get me started on the nightmare of trying to keep everything up to date. I mean, imagine having to update every single row in both the `following` and `followers` tables just because someone changed their username. Talk about a headache.

But fear not, my friends, because where there's a problem & there's a solution. And in this case, it's all about finding the right abstraction. When one user decides to follow another, what's really happening? It's not rocket science. We're creating a relationship, plain and simple. And when that relationship ends? We're destroying it. It's the circle of life(Sing it Elton!).

### Active vs. Passive Relationships: Morty Can Stalk Rick Without Rick Even Noticing

In the world of stalking...sorry, I mean following, relationships can be a bit one-sided. Morty might be obsessed with Rick, but Rick might not even know Morty exists. We'll dive into the nuances of active and passive relationships, so you can stalk... I mean, follow, with confidence.

Unlike your typical Facebook-style friendships, where it's all about being BFFs forever, Twitter-style following is a bit more... flexible. Morty can follow Rick without Rick feeling obligated to return the favor. It's like having a one-sided bromance, and it's totally cool. So, to keep things straight, we're talking active and passive relationships. Morty's the active one, hitting that follow button like it's going out of style, while Rick's just chilling on the passive side, soaking up all the love.

We're going to take those active relationships and turn them into something beautiful: an `active_relationships` table. No more redundant info cluttering up the place. Just clean, efficient data storage, the way it should be. And just like that, we've got ourselves a data model that's as sleek and stylish:

![second diagram](/blog/follow-unfollow/second_diagram.png)

Because we’ll end up using the same database table for both active and passive relationships, we’ll use the generic term _relationship_ for the table name, with a corresponding Relationship model. The result is the Relationship data model shown in the picture below. We’ll see how to use the Relationship model to simulate both Active Relationship and Passive Relationship models.

![third diagram](/blog/follow-unfollow/third_diagram.png)

To get started with the implementation, we first generate a migration:

```shell
$ rails generate model Relationship follower_id:integer followed_id:integer
```

This will generate:

```ruby
# db/migrate/[timestamp]_create_relationships.rb

# frozen_string_literal: true

class CreateRelationships < ActiveRecord::Migration[7.1]
  def change
    create_table :relationships do |t|
      t.integer :follower_id
      t.integer :followed_id

      t.timestamps
    end
  end
end
```

Because we will be finding relationships by `follower_id` and by `followed_id`, we should add indexes on each column for efficiency:

```ruby
# frozen_string_literal: true

class CreateRelationships < ActiveRecord::Migration[7.1]
  def change
    create_table :relationships do |t|
      t.integer :follower_id
      t.integer :followed_id

      t.timestamps
    end
    add_index :relationships, :follower_id
    add_index :relationships, :followed_id
    add_index :relationships, [:follower_id, :followed_id], unique: true
  end
end
```

Welcome to the wild and wacky world of multiple-key indexes, where we're about to make each relationship between users unique. We'll start with pairs of IDs, one for the follower and one for the followed, locked in an eternal embrace of digital love. We're saying, "Hey, you two, you're special. No one else can have a relationship quite like yours." It's like the social media version of monogamy. But here's the kicker: if some sneaky punk tries to slide in and create a duplicate relationship, we're shutting that down faster than you can say "Wubba Dubba Dub Dub." Because in the world of data integrity, there's no room for duplicates. It's like trying to wear the same underwear to two different parties—just not gonna fly (and gross).

So, with our trusty multiple-key index, we're keeping those relationships clean, unique, and error-free. Just like Granny's sense of humor—it's one of a kind. And we're not afraid to kick some database butt to make sure everything runs smoothly. So buckle up, because we're about to embark on a trip through the world of data integrity, so let's do this! 🦄

Migrate the `relationships` table to the database:

```shell
$ rails db:migrat
```

### User/Relationship Associations

Before we dive into the juicy stuff like following and followers, we gotta set the stage. It's all about establishing the association between users and relationships. Think of it like setting up a blind date, but instead of awkward small talk, we're talking database relationships.

So, here's the deal: a user is like the puppet master pulling the strings, and relationships are like the marionettes dancing to their tune. Each user `has_many` relationships, because let's face it, we're all social butterflies in this digital age. And since relationships involve two players, it's a two-way street. That's right, a relationship `belongs_to` both a follower and a followed user. It's like the ultimate love triangle, but without all the drama (hopefully). So, strap on, gents & ladies! We're about to embark on a wild ride through the tangled web we weaved of user relationships.

We will create new relationships using the user association, with code such as:

`user.active_relationships.build(followed_id: ...)`

At this point, you might expect application code is similar, but there are two key differences.

First, in the case of the user/post association, we could write

```ruby
class User < ApplicationRecord
   has_many :posts
   .
   .
   .
end
```

We're about to dive into the inner workings of Rails. So, here's the deal: when Rails sees something like `has_many` `:posts`, it's not just randomly picking words out of a hat. No, sir, no siree bob! There's some serious magic going on behind the scenes. You see, Rails has this little trick up its sleeve called the classify method. It's like the Houdini of class naming, taking something like **"foo_bars"** and turning it into **"FooBar"** faster than han a knife fight in a phone booth. So when you see `has_many` `:posts`, just know that Rails is working its classify magic behind the scenes, making sure everything's running smoother than a baby's backside.

`has_many :active_relationships`

Even though the underlying model is called Relationship. We will thus have to tell Rails the model class name to look for.

Second, we will write this in the Post model:

```ruby
class Post < ApplicationRecord
   belongs_to :user
   .
   .
   .
end
```

Alright, let's take a stroll through the labyrinth of database connections, where foreign keys rule the roost and Rails is the master of puppets(🤘) pulling all the strings. When you see that posts table cozying up to a `user_id` attribute, that's not just some random hookup—it's a full-blown love affair. You see, in the land of databases, that `user_id` is like a secret handshake, linking those tables together faster than a toupee in a hurricane.

Rails has this slick little trick tucked up its sleeve called the underscore method. It's like the magician of class naming, waving its wand and transforming **"FooBar"** into **"foo_bar"**. And just like that, Rails knows exactly where to find those foreign keys. But hold onto your hats, because when it comes to users following other users, we're throwing a curveball with that `follower_id`. Yeah, we're shaking things up, keeping Rails on its toes. By default, Rails expects a _foreign key_ of the form `<class>_id`, where `<class>` is the lowercase version of the class name. In the present case, although we are still dealing with users, the user following another user is now identified with the foreign key `follower_id`. So, next time you're knee-deep in database drama, just remember: Rails may be the mastermind, but we're the ones calling the shots. And with a touch of charm and a boat, anything is possible!

```ruby
# app/models/user.rb

# frozen_string_literal: true

class User < ApplicationRecord
  has_many :posts, dependent: :destroy
  has_many :active_relationships, class_name:   "Relationship",
                                  foreign_key:  "follower_id",
                                  dependent:    :destroy
  .
  .
  .
end
```

### Adding the belongs_to associations to the Relationship model.

```ruby
# ap/models/relationship.rb

# frozen_string_literal: true

class Relationship < ApplicationRecord
  belongs_to :follower, class_name: "User"
  belongs_to :followed, class_name: "User"
end
```

Technically, we don't really need the followed association just yet. But, if you know me, I like to keep things symmetrical and sleek, like a well-tailored grundle area. So, why not go the extra mile and implement both follower and followed structures at the same time? It's like having peanut butter and jelly in the same sandwich! Sure, you could have one without the other, but together they just make life a whole lot tastier.

By bringing in both sides of the equation, we're not just building a system, we're crafting a work of art.

A summary of user/active relationship association methods:

| Method                                                           | Purpose                                                                      |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `active_relationship.follower`                                   | returns the follower                                                         |
| `active_relationship.followed `                                  | returns the followed user                                                    |
| `user.active_relationships.create (followed_id: other_user.id)`  | creates an active relationship associated with `user`                        |
| `user.active_relationships.create! (followed_id: other_user.id)` | creates an active relationship associated with `user` (exception on failure) |
| `user.active_relationships.build (followed_id: other_user.id)`   | returns a new relationship object associated with `user`                     |

### Adding the Relationship model validations

We’ll add a couple of Relationship model validations for for HR transparancy.

```ruby
# app/models/relationship.rb

# frozen_string_literal: true

class Relationship < ApplicationRecord
  belongs_to :follower, class_name: "User"
  belongs_to :followed, class_name: "User"
  validates :follower_id, presence: true
  validates :followed_id, presence: true
end
```

### Followed Users

Buckle up, folks, because we're about to dive into the heart of the Relationship associations: following and followers. We're going to bust out the big guns and using `has_many :through` for the first time. It's like upgrading from a tricycle to a Ferrari. We're about to kick things into 4th gear. A user has many following through relationships. We're forging connections through the digital ether, linking users together in a beautiful web of social interaction. By default, Rails looks for a foreign key that matches the singular version of the association. Hey, let's face it, `user.followeds` is about as clunky as a grown out mullet. So instead, we're going with `user.following`. Smooth, elegant, like a fine whiskey🥃🎩

But wait, there's more! Rails is all about customization. So, if we want to spice things up even further, we can use the `source` parameter to explicitly tell Rails where to find the `source` of our following array. It's like giving directions to a lost puppy except in this case, we're guiding Rails to the set of followed ids. Because let's be real, nobody likes getting lost in the database.

### Adding the User model following association.

```ruby
# app/models/user.rb

# frozen_string_literal: true

class User < ApplicationRecord
   has_many :microposts, dependent: :destroy
   has_many :active_relationships, class_name:  "Relationship",
                                   foreign_key: "follower_id",
                                   dependent:   :destroy
   has_many :following, through: :active_relationships, source: :followed
   .
   .
   .
end
```

The association leads to a powerful combination of Active Record and array-like behavior. For example, we can check if the followed users collection includes another user with the `include?` method, or find objects through the association:

`user.following.include?(other_user)`
`user.following.find(other_user)`

We can also add and delete elements just as with arrays:

`user.following << other_user`
`user.following.delete(other_user)`

Although in many contexts we can treat following like your favorite pair of jeans, comfortable and familiar. Rails is a sneaky little devil that's smarter than you think. Take, for example, code like `following.include?(other_user).` On the surface, it looks like we're about to embark on a database spelunking expedition, pulling all the followed users out of the database to do a comparison. But hold onto your hats, because Rails has a trick up its sleeve. You see, Rails is like a ninja in the night, silently orchestrating things behind the scenes. Instead of dragging every followed user out into the spotlight, it arranges for the comparison to happen directly in the database.

To manipulate following relationships, we’ll introduce `follow` and `unfollow` utility methods so that we can write, e.g., `user.follow(other_user)`. We’ll also add an associated `following?` boolean method to test if one user is following another.

Utility methods are like the punchlines. Sometimes you see them coming, sometimes you don't, but either way, it's all part of the fun. With experience comes the ability to predict these bad boys in advance, but even if you're caught off guard, don't sweat it. Software development is a journey of trial and error, where you write code, test it out, and if it starts to look as ugly as a chimichanga that's been sitting in the sun too long, you roll up your sleeves and refactor it. So, lets keep hacking away, there's always another joke, another punchline, and another chance to make it right 🍕🔥

### Utility methods for following.

```ruby
# app/models/user.rb

# frozen_string_literal: true

class User < ApplicationRecord
   .
   .
   .
   # Follows a user.
   def follow(other_user)
      following << other_user unless self == other_user
   end

   # Unfollows a user.
   def unfollow(other_user)
      following.delete(other_user)
   end

   # Returns true if the current user is following the other user.
   def following?(other_user)
      following.include?(other_user)
   end

   private
   .
   .
   .
end
```

### Followers

Like putting together a jigsaw puzzle, instead of a picture of a sunset, we're crafting a masterpiece of database wizardry. We're adding a `user.followers` method to complement the `user.following` method. It's like having yin without yang. All the juicy details we need to extract an array of followers are already chilling in the relationships table. And we're flipping the script, reversing the roles of `follower_id` and `followed_id`, and introducing `passive_relationships` to the mix. Like turning the world upside down and seeing it from a whole new perspective. The end result is going to be more beautiful than a unicorn riding a rainbow through a field of chimichangas 🦄🌈🔥

![fourth diagram](/blog/follow-unfollow/fourth_diagram.png)

### Implementing `user.followers` using passive relationships.

```ruby
# app/models/user.rb

# frozen_string_literal: true


class User < ApplicationRecord
   has_many :microposts, dependent: :destroy
   has_many :active_relationships,   class_name:   "Relationship",
                                     foreign_key:  "follower_id",
                                     dependent:    :destroy
   has_many :passive_relationships,  class_name:   "Relationship",
                                     foreign_key:  "followed_id",
                                     dependent:    :destroy
   has_many :following, through: :active_relationships, source: :followed
   has_many :followers, through: :passive_relationships, source: :follower
   .
   .
   .
end
```

It’s worth noting that we could actually omit the `:source` key for `followers` using simply:

`has_many :followers, through: :passive_relationships`

This is because, in the case of a `:followers` attribute, Rails will singularize “followers” and automatically look for the foreign key `follower_id` in this case. This keeps the `:source` key to emphasize the parallel structure with the `has_many` `:following` association.

### Sample Following Data

I find it convenient to use `rails db:seed` to fill the database with seed data. Here we somewhat arbitrarily arrange for the first user to follow users 3 through 51, and then have users 4 through 41 follow that user back. The resulting relationships will suffice for developing the application interface:

```ruby
db/seeds.rb

# Users
User.create!(name:  "Example User",
             email: "example@t0nylombardi.dev",
             password:              "foobar",
             password_confirmation: "foobar",
             admin:      true,
             activated:  true,
             activated_at: Time.zone.now)

99.times do |n|
  name = Faker::Name.name
  email = "example-#{n+1}@t0nylombardi.dev"
  password = "password"
  User.create!(name:    name,
               email:   email,
               password:              password,
               password_confirmation: password,
               activated: true,
               activated_at: Time.zone.now)
end

# Posts
users = User.order(:created_at).take(6)
50.times do
  content = Faker::Lorem.sentence(5)
  users.each { |user| user.posts.create!(content: content) }
end

# Create following relationships.
users = User.all
user = users.first
following = users[2..50]
followers = users[3..40]
following.each { |followed| user.follow(followed) }
followers.each { |follower| follower.follow(user) }
```

To execute this code, we will reset and seed the database:

```shell
$ rails db:migrate:reset
$ rails db:seed
```

### Adding following and followers actions to the Users controller.

```ruby
# config/routes.rb

# frozen_string_literal: true

Rails.application.routes.draw do
   .
   .
   .
   resources :users do
      member do
         get :following, :followers
      end
   end
   .
   .
   .
end
```

The intricacies of routing in Rails. Like a well-choreographed tango, each step is perfectly timed and executed. The URLs for following and followers `/users/1/following` and `/users/1/followers`, respectively are straightforward. With both pages showcasing data, we opt for the HTTP verb `GET`, ensuring the URLs respond just the way we want them to. And here's where it gets interesting: the `member` method ensures our routes respond to URLs containing the user ID, while the collection method works its magic without the need for IDs. So, whether you're stalking or being stalked, rest assured that Rails has got your back.

For more details on such routing options, see the Rails Guides article on [Rails Routing from the Outside In ](https://guides.rubyonrails.org/routing.html).

| HTTP request method | URL                | Action      | Named route              |
| ------------------- | ------------------ | ----------- | ------------------------ |
| GET                 | /users/1/following | `following` | `following_user_path(1)` |
| GET                 | /users/1/followers | `followers` | `followers_user_path(1)` |

### Adding the routes for user relationships.

```ruby
# config/routes.rb

# frozen_string_literal: true

Rails.application.routes.draw do
   root     "static_pages#home"

   resources :users do
     member do
        get :following, :followers
     end
   end
   resources :relationships, only: [:create, :destroy]
end
```

### Skills to the Test

Now that you've mastered the art of stalking... I mean, following, it's time to show off your skills. We'll add some slick actions to your controllers so you can see who's stalking... I mean, following, you and who you're stalking... I mean, following. It's like a social networking power play, but with less drama and more Ruby.

With these tips and tricks, you'll be the master of social stalking... I mean, following, in no time. So go forth, my wayward son, build that social network of your dreams. And remember: with great power comes great stalking... responsibility... and a whole lot of cat videos. Happy coding! 🚀🐱

Cheers
