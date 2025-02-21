---
title: Tracking Pixels in ruby
date: '2020-12-29T20:59:56.707Z'
heroImage: '/blog/ruby-pixel-tracker/tracking-pixels-ruby.jpeg'
image: '/blog/ruby-pixel-tracker/tracking-pixels-ruby.jpeg'
originalDatePublished: '2014-11-18'
description: "The simplest way to do this is via a tracking pixel – a small, invisible image that is loaded from your server every time your medium is opened."
author: "t0nylombardi"
categories: [ruby]
tags: [ruby]
draft: false
---

If you are sending out content to your customers, it pretty handy to know if the content is loading. I speak if you are sending out emails, newsletters, ads, etc. If you have ever sent out an email newsletter from a service like Mailchimp, you would have seen email open graphs. Of course, tracking this stuff is super important for a campaign, but it would also be interesting to see if users are seeing your content.

The simplest way to do this is via a tracking pixel – a small, invisible image that is loaded from your server every time your medium is opened. This is fairly simple to achieve using Rails by building a simple Rack application.

## The idea

Picture you are creating ads for clients and you are sending them out to ad shops. If you are using a program like Google Doubleclick. Google DoubleClick allows you to track your ad through a pixel tracking url. This data can be gathered to figure out trends when those ads, emails, or newletters are being opened.

## The Setup

We’ll add one model: One to tracking pixels:

`rails g model Pixel ip_address, campaign, content_type, created_at:date ,city, state, user_agent, referral, banner_size`

All of these fields are strings except for created_at so by default they are created as strings.

the general idea we have here is to get attach a url into an email or something to see if its being loaded such as:

`yourUrl.com/assets/tracker.gif?campaign=SomeCampaign&banner_size=300x250&content_type=Email`

## Right, now the magic bit:

Create a directory called /lib/tracker and create a new file called rack.rb

```ruby
# app/lib/tracker/rack.rb

module Tracker
  class Rack

    def initialize(app)
      @app = app
    end

    def call(env)
      @req = ::Rack::Request.new(env)
      if @req.path_info =~ /tracker.gif/
        result = Services::Params.deploy @req.query_string
        location = Services::Locations.lookup(@req.ip)
        ip_address = location["ip"] || @req.ip
        params = {
          ip_address:     ip_address,
          campaign:       result[:campaign],
          banner_size:    result[:banner_size],
          content_type:   result[:content_type],
          city:           location["city"],
          state:          location["region_name"],
          user_agent:     @req.user_agent,
          referral:       @req.referer
        }

        if @pixels = Pixel.create!(params)
          [
            200, { 'Content-Type' => 'image/gif' },
            [File.read(File.join(File.dirname(__FILE__), 'tracker.gif'))]
          ]
        else
          Rails.logger.warn "\n\n Failed to create record on:#{Date.today}"
        end
      else
        @app.call(env)
      end
    end

  end
end
```

Within the method call, several things happen. First is that it will listen to the incomming request for the pixel which we will get into that later. Second we will call on the module Services. The services module does nost if tge heavy lifting for us. In the in lib/servies/ folder will be two files.

What we need to essentially do is to get the url params, brake them up and return a hash of values that can be entered into the database.

##### Params:

```ruby
# lib/services/params.rb

module Services
  class Params
    require 'active_support/all'

    def self.deploy(obj)
      @url_obj = obj
      if obj.class == ActionController::Parameters
        return_new_hash @url_obj
      else
        check_for_decode
      end
    end

    def self.check_for_decode
      if is_base_64 @url_obj
        str = decode(@url_obj)
        return_params(str)
      else
        return_params @url_obj
      end
    end

    def self.return_new_hash(hash)
      hash[:campaign] = hash.delete(:track)
      campaign = hash[:campaign].split(/=/)
      hash[:campaign] = campaign[1]
      hash
    end

    def self.return_params(str)
      arry  = str.split(/&/)
      hash = {}
      if arry.length <= 1
        raise ActionController::RoutingError.new('Not Found')
      else
        arry.each{|a| hash[a.scan(/^\w*/).join('').to_sym] = a.gsub(/^(\w*=)/,'')}
      end
      hash
    end

    def self.decode(str)
      str = Base64.urlsafe_decode64(str)
    end

    def self.is_base_64(str)
      str =~ /^([A-Za-z0-9+\/]{4})*([A-Za-z0-9+\/]{4}|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{2}==)$/
    end

  end
end
```

this class also works for encoding whole params into a single 64base string(don't ask why. it was a good idea at the time)

The other part of the module handles location. This calls from a ip location service [http://freegeoip.net](http://freegeoip.net).

##### Locations:

```ruby
# lib/services/locations.rb

module Services
  class Locations
    require 'net/http'

    def self.lookup(ip)
      ip_address = ip
      unless Rails.env.production?
        ip_address = random_ip_address
      end
      url = "http://freegeoip.net/json/#{ip_address}"
      begin
        HTTParty.get(url, timeout: 2)
      rescue Timeout::Error
        Rails.logger.warn("Could not post to #{url}: timeout")
        {city: nil, region_name: nil}
      rescue
        Rails.logger.warn("Could not post to #{url}")
        {city: nil, region_name: nil}
      end
    end

    def self.check_for_local(ip)
      if ["127.0.0.1", "::1"].include? ip
        "108.41.23.150"
      else
        ip
      end
    end

    # These are fake IPS. Put real physical IPS when
    # testing in developement enviorment.
    def self.random_ip_address
      %w{ 127.19.209.10
          127.21.23.150
          127.31.23.155
          127.41.23.170
          127.59.209.14
          127.69.209.80 }.sample
    end

  end
end
```

Last thing we need to do is to make a 1x1 opaque pixel and call it tracker.gif and put it app/assets/images && also in lib/tracker.

You can also add some validations to your model

```ruby
class Pixel < ActiveRecord::Base
  validates_presence_of :ip_address
end
```

So there you have it. The heart of the program lies within your lib folder and calls on Rack to listen for that pixel. I am sure there is more we can add to this idea. There is no front end to this, you will have to take the numbers off your database.

Happy Coding =)
