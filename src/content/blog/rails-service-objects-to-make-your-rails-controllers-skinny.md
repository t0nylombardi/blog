---
title: 'Rails Service Objects to Make your Rails Controllers Skinny'
date: '10-11-2023'
heroImage: '/blog/skinny-controllers/services-object.jpeg'
image: '/blog/skinny-controllers/service-objects.jpeg'
originalDatePublished:
description: 'Moving logic into services to keep your controllers/models skinny'
author: 'Anthony Lombardi'
categories: [ruby]
tags: [ruby]
draft: false
---

In the realm of web development, efficiency and maintainability are paramount. As applications grow in complexity, the need for clean, organized code becomes increasingly apparent. When studying Rails design patterns, you may have heard the axiom "fat model, skinny controller" (or the inverse, "fat controller, skinny model"). Both of these describe a pattern of where to put business logic, which tends to take up a lot of lines of code. In either case is ideal, we want our controllers and our models to be "skinny", with as little code as possible, so that they are easy to understand and maintain. In this blog post, we'll delve into the concept of Rails service objects, exploring their benefits and best practices.

### Service Objects: Another place to put your business logic

Rails service objects are plain old Ruby objects(PORO) and responsible for encapsulating business logic related to a specific task or operation within an application. They serve as an intermediary layer between controllers and models, isolating complex operations from the rest of the application.

Service objects live in the /app/services/ directory, and any classes defined therein will be autoloaded (as the rest of the /app/ directory).
We can define a service object class, move our business logic to it, and thus keep our controllers and models "skinny" by keeping only controller or model-related code in them. All that extra business logic can be invoked by instantiating a service object only when needed.

Ergo, we achieve:

- Improved Readability: By encapsulating specific functionality within service objects, code becomes more readable and understandable. Each service object represents a single responsibility, making it easier to navigate and maintain the codebase.
- Reusability: Service objects promote code reusability by encapsulating reusable pieces of logic. Once defined, service objects can be invoked from multiple controllers or other service objects, reducing code duplication.
- Testability: Service objects facilitate testing by isolating business logic from the rest of the application. With clear inputs and outputs, it becomes straightforward to write unit tests for individual service objects, ensuring the reliability of the codebase.
- Decoupling: By extracting business logic into service objects, the application becomes less dependent on the Rails framework. This decoupling enhances the modularity of the codebase and simplifies future changes or migrations to different frameworks.

#### Best practices:

- Single Responsibility Principle (SRP): Each service object should adhere to the SRP, focusing on a single task or operation. This ensures that service objects remain cohesive and maintainable.
- Descriptive Naming: Choose descriptive names for service objects that reflect their purpose and functionality within the application. Clear naming conventions enhance code readability and comprehension.
- Dependency Injection: Avoid hardcoding dependencies within service objects. Instead, utilize dependency injection to inject required dependencies, making service objects more flexible and easier to test.
- Error Handling: Implement robust error handling mechanisms within service objects to handle unexpected scenarios gracefully. Proper error handling improves the resilience of the application and enhances the user experience.
- Documentation: Document the purpose, inputs, outputs, and usage of each service object to facilitate collaboration and understanding among team members. Clear documentation serves as a valuable resource for developers working on the codebase.

### Example:

A perfect example of a "fat controller" ripe for refactoring through service objects lies in a controller designed for an ElasticSearch implementation. This particular controller undertakes the task of searching Users, Hashtags, and first/last names within a Profile model. The initial logic of the code lacks the principles of DRY (Don't Repeat Yourself), primarily due to its repetitive nature in traversing three distinct models.

Here, we defined a bunch of business logic in the mentions_controller.rb to query ElasticSearch:

```ruby
# /app/controller/mentions_controller.rb
class MentionsController < ApplicationController

  def index
    @mentions = Searchkick.multi_search([hashtags, users, profiles]).flatten

    respond_to do |format|
      format.json { render json: @mentions.to_json }
    end
  end

  private

  def hashtags
    HashTag.search(params[:query], boost_by_recency: { created_at: { scale: '7d', decay: 0.5 } },
                                   limit: 5)
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

What if we wanted to add different models, and wrote a bunch of new functions to search and parse its data? Our controller could get out of control (and hard to understand/maintain) VERY quickly!

So, let's create a new /app/services/ directory, and add a dedicated service object to handle the ElasticSearch querying logic --let's call it `mentions_query_service.rb`:

```ruby
# /app/services/mentions_query_service.rb
# frozen_string_literal: true

# This class encapsulates the logic for performing search operations on predefined models such as User, Profile, and Hashtag.
#
class MentionsQueryService < ApplicationService
  SEARCH_MODELS = %w(HashTag User Profile).freeze
  LIMIT = 5

  # @!attribute query
  #   @return [String] The search query string.
  attr_accessor :query

  # Initializes a new instance of the MentionsQueryService.
  #
  # @param query [String] The search query string.
  def initialize(query: String)
    @query = query
  end

  # Executes the search query across multiple models.
  #
  # @return [Hash] A hash containing the search results and success/error status.
  def execute!
    multi_search

    if @mentions.nil?
      errors.add(:base, 'query is empty')
    else
      { success: true, data: @mentions, errors: [] }
    end
  end

  private

  # Performs a search query across multiple models.
  #
  # @return [Boolean] Returns false if the query is blank, otherwise returns true.
  def multi_search
    return false if query.blank?

    search_array = []
    SEARCH_MODELS.each do |model|
      search_array << mention_query(model)
    end

    @mentions = Searchkick.multi_search(search_array)
  end

  # Executes a search query on a specified model using ElasticSearch.
  #
  # @param model [String] The name of the model to search.
  # @return [Array] The search results.
  #
  # @example Perform a search query on the User model
  #   mention_query("User")
  #
  # @note This method relies on the ElasticSearch implementation for search functionality.
  def mention_query(model)
    model.constantize.search(query, fields: fields(model), boost_by_recency:, limit:)
  end

  # Defines the boosting parameters for recency in search results.
  #
  # @return [Hash] A hash specifying the boosting parameters.
  def boost_by_recency
    {
      created_at: {
        scale: '7d',
        decay: 0.5
      }
    }
  end

  # Retrieves the fields to be searched for the specified model.
  #
  # @param model [String] The name of the model.
  # @return [Array] An array of symbols representing the fields to search.
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

  # Retrieves the limit for the number of search results.
  #
  # @return [Integer] The limit for search results.
  def limit
    LIMIT
  end
end

```

Note: to not use self for every method, I created `ApplicationService` that `MentionsQueryService` extends. you can check out the code [here](https://gist.github.com/t0nylombardi/c6671135e208e23cb71e46fd61c1ae37).

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

We can now call `MentionsQueryService` to handle all of the ElasticSearch-querying and data-parsing outside of the controller. This makes our controller a lot easier to read and understand!

Note: Although the examples here are exclusively related to making "skinny" controllers, the same types of logic/methods can be moved from models to service objects as well.

### Conclusion

Utilizing Rails service objects constitutes a robust strategy for consolidating business logic and fortifying code organization within your application. By harnessing the advantages of service objects, we can elevate the maintainability, reusability, and testability of our controllers and models. Integrating service objects into your development workflow fosters clarity and enhances the long-term scalability of your application.

When confronted with intricate business logic in your controllers or models, contemplate employing service objects to encapsulate that logic. This approach ensures streamlined and efficient controllers/models, fostering a codebase that is both agile and resilient over time.
