---
layout: '../../layouts/BlogLayout.astro'
title: Parsing An Email List
date: '2020-12-29T20:57:55.934Z'
coverImage: ''
originalDatePublished: '2014-11-18'
description: 'I been written a code to parse through an email list a client gave me that has roughly 94 emails.'
author: 't0nylombardi'
image: 'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7'
categories: [ruby]
tags: [ruby]
---

Haven’t wrote in this in a while. I wanted this to be a portal to show all the work I do. Coding, Graphics, Music, random thoughts. I been written a code to parse through an email list a client gave me that has roughly 94 emails. The list is old and we don’t know how many of them are actually legit. So my thoughts where to run through the script and first get out all the emails that are misspelled. Second would be to check if the mx record of that email address still exist. The whole loop through create 3 list. Bad_emails(all misspelled emails) Good_emails(all that I going to assume that are good) and Rejected_emails(based off a regex code on the assumption of what a regular email would be) The initial run of my idea came out to be roughly 54k emails. The reason I separated the list into three categories is that, well there is many debated on to what is a real email address and what is not. Plus the assumption of checking the mx record could give false negatives and vice verse.

Here is the code.

```ruby
# code to parse a text file that has 94k emails to check whether
# the emails are somewhat valid.

options = { :on => true,:check_mx => true, :local_length => 25,:domain_length => 10 }

def is_a_valid_email?(email)
    (email =~ /^([\w+\-].?)+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+$/i)
end

f = File.open("emails.txt", "r")
line_number = 1
invailid_email = 1
f.each_line do |email|

    if is_a_valid_email?(email)
        results = ValidatesEmailFormatOf::validate_email_format(email, options)
        if results.nil?
            File.open("good_emails.txt", 'a+') { |file| file.write(email) }
            printf "%-5s %s", line_number, email
        else
            File.open("rejected_emails.txt", 'a+') { |file| file.write(email) }
          print "\t\t#{email.gsub(/\n/," ")}: #{results.join(', ')}\n"
          invailid_email += 1
        end
    else
        printf "%-5s %s\n", line_number, email
        File.open("bad_emails.txt", 'a+') { |file| file.write(email) }
    end
      line_number += 1
    end
file.close
```
