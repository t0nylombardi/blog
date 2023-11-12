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
draft: true
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
A perfect example of a "fat controller" we could refactor with service objects is my previous post's app to render Magic: the Gathering card art.

Here, we defined a bunch of business logic in our pages_controller.rb to query the Scryfall API:
# /app/controller/pages_controller.rb

class PagesController < ApplicationController
  def index
    session[:img_array] ||= []  # refactor with ||= pointed out by Andrew Brown

    if session[:img_array].empty? || params["button_action"] == "refresh"
      session[:img_array] = get_scryfall_images
    end
  end


  private

  def get_json(url)
    response = RestClient.get(url)
    json = JSON.parse(response)
  end

  def parse_cards(json, img_array)
    data_array = json["data"]
    data_array.each do |card_hash|
      if card_hash["image_uris"]
        img_hash = {
          "image" => card_hash["image_uris"]["art_crop"],
          "name" => card_hash["name"],
          "artist" => card_hash["artist"]
        }
        img_array << img_hash
      end
    end

    if json["next_page"]
      json = get_json(json["next_page"])
      parse_cards(json, img_array)
    end
  end

  def get_scryfall_images
    api_url = "https://api.scryfall.com/cards/search?q="
    img_array = []
    creature_search_array = ["merfolk", "goblin", "angel", "sliver"]

    creature_search_array.each do |creature_str|
      search_url = api_url + "t%3Alegend+t%3A" + creature_str
      json = get_json(search_url)
      parse_cards(json, img_array)

      sleep(0.1)  # per the API documentation: https://scryfall.com/docs/api
    end

    img_array.sample(9)
  end
end
But pretty much everything below the private keyword is NOT related to the controller--it's just logic to query a specific API.

What if we wanted to query a different card game's API, and wrote a bunch of new functions to fetch and parse its data? Our controller could get out of control (and hard to understand/maintain) VERY quickly!

So, let's create a new /app/services/ directory, and a dedicated service object to handle the Scryfall API-querying logic--let's call it scryfall_query_service.rb:
# /app/services/scryfall_query_service.rb
class ScryfallQueryService
    def get_json(url)
        response = RestClient.get(url)
        json = JSON.parse(response)
    end

    def parse_cards(json, img_array)
        data_array = json["data"]
        data_array.each do |card_hash|
            if card_hash["image_uris"]
                img_hash = {
                    "image" => card_hash["image_uris"]["art_crop"],
                    "name" => card_hash["name"],
                    "artist" => card_hash["artist"]
                }
                img_array << img_hash
            end
        end

        if json["next_page"]
        json = self.get_json(json["next_page"])
        self.parse_cards(json, img_array)
        end
    end

    def get_scryfall_images
        api_url = "https://api.scryfall.com/cards/search?q="
        img_array = []
        creature_search_array = ["merfolk", "goblin", "angel", "sliver"]

        creature_search_array.each do |creature_str|
            search_url = api_url + "t%3Alegend+t%3A" + creature_str
            json = self.get_json(search_url)
            self.parse_cards(json, img_array)

            sleep(0.1)  # per the API documentation: https://scryfall.com/docs/api
        end

        img_array.sample(9)
    end
end
Note that we need to add self. before our calls to these instance methods! (self.get_json and self.parse_cards)

And now, we can make our pages_controller.rb much "skinnier" by completely removing those same methods:
# /app/controllers/pages_controller.rb

class PagesController < ApplicationController
  def index
    session[:img_array] ||= []

    if session[:img_array].empty? || params["button_action"] == "refresh"
      scryfall_query_service = ScryfallQueryService.new
      session[:img_array] = scryfall_query_service.get_scryfall_images
    end


    session[:refresh_counter] ||= 0

    if params["button_action"] == "refresh"
      session[:refresh_counter] += 1
    end

    @refresh_counter = session[:refresh_counter]
  end
end
Now, we can instantiate a ScryfallQueryService object, and all its get_scryfall_images method to handle all of the API-querying and data-parsing outside of the controller. This makes our controller a lot easier to read and understand!

Note: Although the examples here are exclusively related to making "skinny" controllers, the same types of logic/methods can be moved from models to service objects as well!

Service Objects and Modular Design: Adding a new API-querying service object
One of the benefits of having this API-querying business logic wrapped in the ScryfallQueryService object is that we can now expand our app to include other service objects that query other APIs, without interrupting the functionality of our ScryfallQueryService or adding more logic to our pages_controller.rb.

Let's say we want to add a route to our app that will render card art from the Star Wars CCG instead. This will require us to query a different API altogether, and thus parse the JSON we get back in a different way than ScryfallQueryService.

The API we'll be using for card art from the Star Wars CCG is SWCCGDB, a fan-maintained database for the now-fan-maintained game that was "officially" discontinued in 2001.

Since the JSON we get back from the API is structured differently, both our parse_cards and get_swccgdb_images methods will be different from ScryfallQueryService. Here's the code:
# /app/services/swccgdb_query_service.rb

class SWCCGDBQueryService
    def get_json(url)
        response = RestClient.get(url)
        json = JSON.parse(response)
    end

    def parse_cards(json, img_array)
        data_array = json   # api returns all cards in a single array at top level of json
        data_array.each do |card_hash|
            if card_hash["type_code"] == "character"
                img_hash = {
                    "image" => card_hash["image_url"],
                    "name" => card_hash["name"],
                    "artist" => "Lucasfilm / Decipher / Wizards of the Coast / SWCCG Player's Committee"
                }
                img_array << img_hash
            end
        end
    end

    def get_swccgdb_images
        api_url = "https://swccgdb.com/api/public/cards/"
        img_array = []
        set_search_array = ["pr", "hoth", "cc"]     # premiere, hoth, and cloud city sets

        set_search_array.each do |set_str|
            search_url = api_url + set_str + ".json?_format=json"
            json = self.get_json(search_url)
            self.parse_cards(json, img_array)
        end

        img_array.sample(9)
    end
end
Most of our code can be copied directly from scryfall_query_service.rb, but note several differences:

in get_swccgdb_images, we are now searching through different game sets ("Premiere", "Hoth", and "Cloud City") instead of creature types
also in get_swccgdb_images, the API URL is different (obviously), and our search_url string is constructed differently
in parse_cards, we assign the JSON directly to the data_array variable due to the structure of the API's JSON response
also in parse_cards, we are now filtering cards for card_hash["type_code"] == "creature"
Now, we can build another route in our pages_controller.rb and routes.rb files to use the ScryfallQueryService at localhost:3000/mtg, and SWCCGDBQueryService at localhost:3000/swccg.

Let's update pages_controller.rb first. Instead of one index method, let's define one for mtg (Magic: the Gathering) and one for swccg (Star Wars CCG):
class PagesController < ApplicationController
  # def index
  #   session[:img_array] ||= []

  #   if session[:img_array].empty? || params["button_action"] == "refresh"
  #     scryfall_query_service = ScryfallQueryService.new
  #     session[:img_array] = scryfall_query_service.get_scryfall_images
  #   end


  #   session[:refresh_counter] ||= 0

  #   if params["button_action"] == "refresh"
  #     session[:refresh_counter] += 1
  #   end

  #   @refresh_counter = session[:refresh_counter]
  # end


  def mtg
    # use ScryfallQueryService here
  end


  def swccg
    # use SWCCGDBQueryService here
  end

end
Now, let's copy the logic from index into our two new methods. Under swccg, we'll also change our service object to be an instance of SWCCGDBQueryService:
# /app/controller/pages_controller.rb

class PagesController < ApplicationController
  def mtg
    session[:img_array] ||= []

    if session[:img_array].empty? || params["button_action"] == "refresh"
      scryfall_query_service = ScryfallQueryService.new
      session[:img_array] = scryfall_query_service.get_scryfall_images
    end


    session[:refresh_counter] ||= 0

    if params["button_action"] == "refresh"
      session[:refresh_counter] += 1
    end

    @refresh_counter = session[:refresh_counter]
  end


  def swccg
    session[:img_array] ||= []

    if session[:img_array].empty? || params["button_action"] == "refresh"
      swccgdb_query_service = SWCCGDBQueryService.new
      session[:img_array] = swccgdb_query_service.get_swccgdb_images
    end


    session[:refresh_counter] ||= 0

    if params["button_action"] == "refresh"
      session[:refresh_counter] += 1
    end

    @refresh_counter = session[:refresh_counter]
  end

end
Next, let's add an if block to the top of both methods so our session can keep track of which game its storing card art for--that way, if we switch from localhost:3000/mtg to localhost:3000/swccg, the API will know to empty out our session[:img_array] and fetch new cards from the correct game:
# /app/controller/pages_controller.rb

class PagesController < ApplicationController
  def mtg
    if session[:game] == "swccg" || !session[:game]   # empty img_array if switching games
      session[:img_array] = []
      session[:game] = "mtg"
    end

    session[:img_array] ||= []

    if session[:img_array].empty? || params["button_action"] == "refresh"
      scryfall_query_service = ScryfallQueryService.new
      session[:img_array] = scryfall_query_service.get_scryfall_images
    end


    session[:refresh_counter] ||= 0

    if params["button_action"] == "refresh"
      session[:refresh_counter] += 1
    end

    @refresh_counter = session[:refresh_counter]
  end


  def swccg
    if session[:game] == "mtg" || !session[:game]   # empty img_array if switching games
      session[:img_array] = []
      session[:game] = "swccg"
    end

    session[:img_array] ||= []

    if session[:img_array].empty? || params["button_action"] == "refresh"
      swccgdb_query_service = SWCCGDBQueryService.new
      session[:img_array] = swccgdb_query_service.get_swccgdb_images
    end


    session[:refresh_counter] ||= 0

    if params["button_action"] == "refresh"
      session[:refresh_counter] += 1
    end

    @refresh_counter = session[:refresh_counter]
  end

end
This is great, but our controller isn't very "skinny" now, which is why we're creating service objects in the first place! The problem is that our code is not DRY--we have mostly duplicated the code from index, and it now appears twice in our controller.

Let's refactor the session-checking-and-setting logic into its own private method update_session, where we can pass the parameter "mtg" or "swccg" to set the session[:game] variable and use the correct service object:
# /app/controllers/pages_controller.rb

class PagesController < ApplicationController
  def mtg
    update_session("mtg")
    @refresh_counter = session[:refresh_counter]
  end

  def swccg
    update_session("swccg")
    @refresh_counter = session[:refresh_counter]
  end


  private

  def update_session(current_game)
    if session[:game] != current_game || !session[:game]   # empty img_array if switching games
      session[:img_array] = []
      session[:game] = current_game
    end

    session[:img_array] ||= []

    if session[:img_array].empty? || params["button_action"] == "refresh"
      if current_game == "mtg"
        scryfall_query_service = ScryfallQueryService.new
        session[:img_array] = scryfall_query_service.get_scryfall_images

      elsif current_game == "swccg"
        swccgdb_query_service = SWCCGDBQueryService.new
        session[:img_array] = swccgdb_query_service.get_swccgdb_images

      # add additional games here
      end
    end

    session[:refresh_counter] ||= 0

    if params["button_action"] == "refresh"
      session[:refresh_counter] += 1
    end
  end

end
Perfect! We can now add additional games into our app by adding another elsif current_game == String branch inside our update_session method, and adding another public method (with only two lines of code inside it!) to pages_controller.rb.

Now, let's update our routes.rb with a Get and Post route to both localhost:3000/mtg and localhost:3000/swccg:
# /config/routes.rb

Rails.application.routes.draw do
  get "/mtg", to: "pages#mtg"
  post "/mtg", to: "pages#mtg"

  get "/swccg", to: "pages#swccg"
  post "/swccg", to: "pages#swccg"
end
And, let's go ahead and make a set of mtg.html.erb and swccg.html.erb views (in the same /app/views/pages/ directory where index.html.erb currently lives). These will automatically render at the end of the mtg and swccg controller methods respectively, and we can customize them with the name of each game:
<%# /app/views/pages/mtg.html.erb %>

<h1>Pages#mtg</h1>
<p>Find me in app/views/pages/mtg.html.erb</p>

<h2>Let's add some Magic: the Gathering card art!</h2>

<div class="card_container">
    <%= render partial: '/pages/cards/card', collection: session[:img_array], as: :img_hash %>
</div>

<div class="refresh_form">
    <%= render partial: '/pages/forms/refresh_button' %>
    <%= render partial: '/pages/forms/refresh_counter', locals: {counter: @refresh_counter} %>
</div>
<%# /app/views/pages/swccg.html.erb %>

<h1>Pages#swccg</h1>
<p>Find me in app/views/pages/swccg.html.erb</p>

<h2>Let's add some Star Wars CCG card art!</h2>

<div class="card_container">
    <%= render partial: '/pages/cards/card', collection: session[:img_array], as: :img_hash %>
</div>

<div class="refresh_form">
    <%= render partial: '/pages/forms/refresh_button' %>
    <%= render partial: '/pages/forms/refresh_counter', locals: {counter: @refresh_counter} %>
</div>
Great! Let's test out our new routes. In your console, run rails s. Navigate to localhost:3000 and you will see the default Rails index page (since we got rid of our index method in pages_controller.rb).

Now let's check out localhost:3000/mtg to see our Magic: the Gathering card art...

screenshot of localhost:3000/mtg showing magic: the gathering card art

And now, let's go to localhost:3000/swccg to see our Star Wars CCG card art...

screenshot of localhost:3000/swccg showing star wars ccg card art

Perfect! As you can see, creating individual service objects to handle each API allows us to separate our concerns, so that the controller can focus on handling controller logic and our API-querying business logic is handled within its own API-specific service object.

Conclusion
Rails service objects allow us to move business logic from controllers (or models) to a separate class, which helps us keep our controllers (and models) "skinny" and focused on their own logic. They also allow us to make our codebase more modular, as we can build our individual service objects instead of cramming more logic into our controllers indefinitely.

Next time you see a lot of logic in your controllers (or models), think about moving some of it to a service object!

Special thanks to Anthony Hernandez for introducing me to service objects! :)
And additional thanks to Andrew Brown for feedback/refactor suggestions on my previous post!
Further reading/links/resources for Rails service objects