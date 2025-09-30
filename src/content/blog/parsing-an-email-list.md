---
title: Parsing An Email List
date: '2020-12-29T20:57:55.934Z'
heroImage: '/blog/parsing-email-list/parsing-emails.jpeg'
image: '/blog/parsing-email-list/parsing-emails.jpeg'
originalDatePublished: '2014-11-18'
description: 'I been written a code to parse through an email list a client gave me that has roughly 94 emails.'
author: 'Anthony Lombardi'
categories: [ruby]
tags: [ruby]
draft: false
---

It's been a while since I last wrote here. I intend for this space to serve as a showcase for all the work I undertake, encompassing coding, graphics, music, and random thoughts. Recently, I have been focused on developing a code to parse through an email list provided by a client, comprising approximately 94 email addresses. Given the list's age and uncertainty regarding its accuracy, my approach involves two main steps.

Firstly, I aim to identify and filter out misspelled email addresses. Subsequently, I plan to verify the existence of the MX record associated with each email address. This process generates three distinct lists: 'Bad_emails' (containing all misspelled addresses), 'Good_emails' (comprising addresses presumed to be valid), and 'Rejected_emails' (based on a regex code designed to identify typical email formats).

The initial implementation of this approach yielded around 54,000 email addresses. I opted for categorization into three lists due to the ongoing debate surrounding what constitutes a genuine email address. Additionally, the verification of MX records introduces the possibility of false negatives and vice versa.

Here is the code.

```ruby
# frozen_string_literal: true

require 'validates_email_format_of'

VALIDATION_OPTIONS = {
  on: true,
  check_mx: true,
  local_length: 25,
  domain_length: 10
}

def valid_email?(email)
  email.match?(/^[\w+\-].?+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+$/i)
end

def process_email(line_number, email)
  if valid_email?(email)
    handle_valid_email(line_number, email)
  else
    handle_invalid_email(line_number, email)
  end
end

def handle_valid_email(line_number, email)
  results = ValidatesEmailFormatOf::validate_email_format(email, VALIDATION_OPTIONS)
  if results.nil?
    write_to_file("good_emails.txt", email)
    print_formatted(line_number, email)
  else
    write_to_file("rejected_emails.txt", email)
    print_rejected(line_number, email, results)
  end
end

def handle_invalid_email(line_number, email)
  write_to_file("bad_emails.txt", email)
  printf("%-5s %s\n", line_number, email)
end

def print_formatted(line_number, email)
  printf("%-5s %s", line_number, email)
end

def print_rejected(line_number, email, results)
  print("\t\t#{email.chomp}: #{results.join(', ')}\n")
end

def write_to_file(file_name, email)
  File.open(file_name, 'a+') { |file| file.write(email) }
end

File.open("emails.txt", "r") do |file|
  line_number = 1
  file.each_line do |email|
    process_email(line_number, email)
    line_number += 1
  end
end
```
