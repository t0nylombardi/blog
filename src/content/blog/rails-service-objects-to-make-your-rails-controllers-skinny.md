---
title: 'Rails Service Objects to Make your Rails Controllers Skinny'
date: '10-11-2023'
coverImage: ''
originalDatePublished:
description: 'Moving logic into services to keep your controllers/models skinny'
author: 't0nylombardi'
image: 'https://images.unsplash.com/photo-1579616043939-95d87a6e8512'
categories: [ruby]
tags: [ruby]
draft: false
---

When studying Rails design patterns, you may have heard the axiom "fat model, skinny controller" (or the inverse, "fat controller, skinny model"). Both of these describe a pattern of where to put business logic, which tends to take up a lot of lines of code.

Neither case is ideal--we want our controllers and our models to be "skinny", with as little code as possible, so that they are easy to understand and maintain. If only we had another place in our Rails app to put this logic...

### Service Objects: Another place to put your business logic

Service objects live in the /app/services/ directory, and any classes defined therein will be autoloaded (as the rest of the /app/ directory).

So, we can define a service object class, move our business logic to it, and thus keep our controllers and models "skinny" by keeping only controller or model-related code in them. All that extra business logic can be invoked by instantiating a service object only when needed.

Thus, we achieve the trifecta:

- our controllers are "skinny", and can focus on controller-logic
- our models are also "skinny", and can focus on model-logic
- our business logic is wrapped in a service object (with the bonus that service objects are easily testable...

### Example:
A perfect example of a "fat controller" we could refactor with service objects is a controller I had used for ElasticSearch...search. This controller needed to search Users, Hashtags, and first/last name in a Profile model. This initial logic of the code is not DRY. It's mostly repeatable since its searching three different models.

Here, we defined a bunch of business logic in the mentions_controller.rb to query the ElasticSearch:

```ruby
# /app/controller/mentions_controller.rb
class MentionsController < ApplicationController

  def index
    @mentions = search_for_mentions

    respond_to do |format|
      format.json { render json: @mentions.to_json }
    end
  end

  private

  def search_for_mentions
    Searchkick.multi_search([hashtags, users, profiles])
    [hashtags, users, profiles].flatten
  end

  def hashtags
    HashTag.search(params[:query], boost_by_recency: { created_at: { scale: '7d', decay: 0.5 } },
                                   limit: 4)
  end

  def users
    User.search(params[:query], boost_by_recency: { created_at: { scale: '7d', decay: 0.5 } },
                                limit: 5)
  end

  def profiles
    Profile.search(params[:query], fields: [:first_name, :last_name],
                                   boost_by_recency: { created_at: { scale: '7d', decay: 0.5 } },
                                   limit: 5)
  end
end
```


Pretty much everything below the private keyword is NOT related to the controller--it's just logic to query a specific API.

What if we wanted to different models, and wrote a bunch of new functions to search and parse its data? Our controller could get out of control (and hard to understand/maintain) VERY quickly!

So, let's create a new /app/services/ directory, and a dedicated service object to handle the ElasticSearch querying logic --let's call it `mentions_query_service.rb`:

```ruby
# /app/services/mentions_query_service.rb
# frozen_string_literal: true

class MentionsQueryService < ApplicationService
  SEARCH_MODELS = %w(HashTag User Profile).freeze
  LIMIT = 5

  attr_accessor :query

  def initialize(query: String)
    @query = query
  end

  def execute!
    multi_search

    if @mentions.nil?
      errors.add(:base, 'query is empty')
    else
      { success: true, data: @mentions, errors: [] }
    end
  end

  private

  def multi_search
    return false if query.blank?

    search_array = []
    SEARCH_MODELS.each do |model|
      search_array << mention_query(model)
    end

    @mentions = Searchkick.multi_search(search_array)
  end

  def mention_query(model)
    model.constantize.search(query, fields: fields(model), boost_by_recency:, limit:)
  end

  def boost_by_recency
    {
      created_at: {
        scale: '7d',
        decay: 0.5
      }
    }
  end

  def fields(model)
    case model.downcase.to_sym
    when :user
      %i(username)
    when :profile
      %i(first_name last_name)
    when :hashtag
      %i(name)
    else
      []
    end
  end

  def limit
    LIMIT
  end
end

```


Note: to not use self for every method, I created  `ApplicationService` that `MentionsQueryService` extends. you can check out the code [here](https://gist.github.com/t0nylombardi/c6671135e208e23cb71e46fd61c1ae37).

And now, we can make our `mentions_controller.rb` much "skinnier" by completely removing those same methods:

```ruby
# /app/controllers/mentions_controller.rb
# frozen_string_literal: true

class MentionsController < ApplicationController
  def index
    @mentions ||= MentionsQueryService.new(params[:query]).call

    respond_to do |format|
      format.json { render json: @mentions.to_json }
    end
  end
end
```


Now, we can call  `MentionsQueryService` to handle all of the ElasticSearch-querying and data-parsing outside of the controller. This makes our controller a lot easier to read and understand!

Note: Although the examples here are exclusively related to making "skinny" controllers, the same types of logic/methods can be moved from models to service objects as well!

### Conclusion
Rails service objects allow us to move business logic from controllers (or models) to a separate class, which helps us keep our controllers (and models) "skinny" and focused on their own logic. They also allow us to make our codebase more modular, as we can build our individual service objects instead of cramming more logic into our controllers indefinitely.

Next time you see a lot of logic in your controllers (or models), think about moving some of it to a service object!
