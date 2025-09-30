---
title: Old-school Twitter Bot in ruby
date: '2014-11-18'
heroImage: '/blog/twitter-bot/old-school-twitter-bot.jpeg'
image: '/blog/twitter-bot/old-school-twitter-bot.jpeg'
author: 'Anthony Lombardi'
originalDatePublished: '2014-11-18'
description: 'I had an idea to try to automate search results and reply back to each user with a message on twitter.'
categories: [ruby]
tags: [ruby]
draft: false
---

### UPDATE: (2022)
X formally know as Twitter no longer allows you to use their api freely and they're much more strict about which apps are allowed to use their api.

 ---

I been trying to help a friend gain more attention to his twitter and his music. I had an idea to try to automate search results and reply back to each user with a message. Upon doing this, I discovered it would take two ruby gems....

First was twitter gem:

```bash
sudo gem install twitter
```

second is tweetstream:

```bash
sudo gem install tweetstream
```

The Twitter gem has streaming aspects in their latest version 5.8.0 say its experimental so I didn’t use it. This is a simple simple bot to run. The main hurtle is to tweet to users that are tweeting about my search field, is that I needed not to get caught by twitter.

My Idea was get a large amount of sentences together and randomly select one of them and tweet it to that user. Each time I tweeted I would let the script sleep for a while anywhere be tween 1 and 120 seconds. Since this is done with a random generator, Most of the time the random number is above 1 minute. Since the tweets are spaced apart time wise, the sentences where different enough to fool Twitter. I’ve tested twice and each time I was able to keep it running for a few hours with no problems.

here’s the script:

```ruby

require 'twitter'
require 'tweetstream'

OpenSSL::SSL::VERIFY_PEER = OpenSSL::SSL::VERIFY_NONE

count = 1
tweets = []
api_keys = {
  consumer_key:         '1234',
  consumer_secret:      '1234',
  access_token:         '1234',
  access_token_secret:  '1234'
}

file = File.open("tweets.txt", "r").each_line do |line|
  tweets << line
end

file.close

client = Twitter::REST::Client.new do |config|
  config.consumer_key        = api_keys[:consumer_key]
  config.consumer_secret     = api_keys[:consumer_secret]
  config.access_token        = api_keys[:access_token]
  config.access_token_secret = api_keys[:access_token_secret]
end

TweetStream.configure do |config|
  config.consumer_key         = api_keys[:consumer_key]
  config.consumer_secret      = api_keys[:consumer_secret]
  config.oauth_token          = api_keys[:access_token]
  config.oauth_token_secret   = api_keys[:access_token_secret]
  config.auth_method          = :oauth
end

puts "Api keys conected ...\n"

begin
  TweetStream::Client.new.on_error do |message|
    puts message
    break
  end.track('keyword', 'keyword2') do |status|
    tweetn = rand(0..tweets.count)
    sleepn = rand(1..120)
    client.update("@#{status.user.screen_name} #{tweets[tweetn]}")
    printf "%-5s %s\n\n",
           "#{count}: #{status.user.screen_name.rjust(10)}",
            tweets[tweetn]
    # Twitter checks for bots like this. Therefore we randomly
    # sleep betwen tweets between 1 - 120 minutes
    sleep sleepn
    count += 1
  end
rescue Twitter::Error
  sleep(5)
  puts "This request looks like it might be automated."
rescue Exception
  puts "some other error happened!"
end

```
