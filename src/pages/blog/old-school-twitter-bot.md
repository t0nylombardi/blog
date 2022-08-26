---
layout: '../../layouts/BlogLayout.astro'
title: Old-school Twitter Bot in ruby
date: '2020-12-29T20:41:18.408Z'
overImage: ''
originalDatePublished: '2014-11-18T00:00:00.000Z'
description: 'I been trying to help a friend get more attention to his twitter and his music. I choose to try to automate search results and reply back to each user with a message.'
image: 'https://images.unsplash.com/photo-1610878785620-3ab2d3a2ae7b'
categories: [ruby]
tags: [ruby]
---

I been trying to help a friend get more attention to his twitter and his music. I choose to try to automate search results and reply back to each user with a message. Upon doing this, I discovered it would take two ruby gems.

First was twitter gem:

`sudo gem install twitter`

second is tweetstream:

`sudo gem install tweetstream`

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
          consumer_key:         '1234,
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
