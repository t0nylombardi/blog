---
title: Rails Console Simplified
date: '2023-08-31T21:00:56.707Z'
heroImage: '/blog/rails-console/rails-console.jpeg'
image: '/blog/rails-console/rails-console.jpeg'
originalDatePublished:
description: 'An article on how to simplify the Rails console command with aliases'
author: 'Anthony Lombardi'
categories: ["rails"]
tags: ["rails", "console"]
draft: false
---


### What are Rails console commands?
Rails console commands what you can politely ask Rails to execute, like launching a local web server, launch test, and so on.

For example, `rails` new will create a new Rails application.

Another example: `bin/rails server` to launch your local web server.

**Side note**: I would advise to use `bin/rails` most of the time. Except maybe to create a new application, because at this moment the command is not available. However, there’s a clever trick for this.

### How do I know which command needs a shortcut?
It’s a matter of feeling. If it’s painful to write `bin/rails db:migrate` again and again, maybe it’s time to define an alias.

How do I define a shortcut?
In linux-based systems, aliases are available through the .bash_aliases or if you are on a newer macOS, it would be [.zshrc](https://ohmyz.sh/) file. Google around if you have never heard about it. It allows you to define shortcuts for the command line, the same way you use acronyms to shorten expressions in your spoken language.

### My shortcut list
This is part of my .zshrc for Rails.

```ruby
alias br='bin/rails'
alias bd="./bin/dev"
alias be='bundle exec'
alias bi='bundle install'
alias eec="export EDITOR='code -w'"
alias brdrol='br db:rollback STEP=1 && bin/rails db:rollback STEP=1 RAILS_ENV=test'
alias brdcm="br db:drop db:create db:migrate"
alias brdcms="br db:drop db:create db:migrate db:seed"
alias resetdbtest='bin/rails db:drop db:create db:migrate RAILS_ENV=test'
alias resetdbdev='bin/rails db:drop db:create db:migrate RAILS_ENV=development'
alias brg='bin/rails generate'
alias spec='bundle exec rspec'
alias fd="foreman start -f Procfile.dev"
```

### Wealthy Rails console commands
**Use acronyms**

In order to remember this list, I also use acronyms, the first letter of each word, so that I still remember what I’m actually typing. For example when I’m typing **“bd”**, in my mind, I’m thinkingabout the words **“bin”** and **“dev”**. If you find an alias that is too cryptic, you won’t be able to work on a teammate’s machine.

### Make some shortcuts more difficult
Sometimes I don’t use acronyms, especially if the command may hurt the application. Like resetting a database. In this case, I write resetdbdev and not rdb, so that I’m sure of what I’m doing

### Cleaning the list from time to time
I don’t know if there are some tools to track which shortcuts are more used. On my side, I just open my .zshrc from time to time to see if everything is

- well written
- still relevant

### List of all Rails commands and options
The official documentation about Rails commands covers most use cases.

If you want to discover all Rails command, enter `$> bin/rails T`

If you want to filter only things related to the database, you can do it like this: `$> bin/rails T db.`

This will output (for Rails 7) :
```ruby
rails db:create # Creates the database from DATABASE_URL or config/database.yml for the current RAILS_...
rails db:drop # Drops the database from DATABASE_URL or config/database.yml for the current RAILS_EN...
rails db:encryption:init  # Generate a set of keys for configuring Active Record encryption in a given environment
rails db:environment:set  # Set the environment value for the database
rails db:fixtures:load  # Loads fixtures into the current environment's database
rails db:migrate  # Migrate the database (options: VERSION=x, VERBOSE=false, SCOPE=blog)
rails db:migrate:down # Runs the "down" for a given migration VERSION
rails db:migrate:redo # Rolls back the database one migration and re-migrates up (options: STEP=x, VERSION=x)
rails db:migrate:status # Display status of migrations
rails db:migrate:up # Runs the "up" for a given migration VERSION
rails db:prepare # Runs setup if database does not exist, or runs migrations if it does
rails db:reset # Drops and recreates all databases from their schema for the current environment and ...
rails db:rollback # Rolls the schema back to the previous version (specify steps w/ STEP=n)
rails db:schema:cache:clear # Clears a db/schema_cache.yml file
rails db:schema:cache:dump  # Creates a db/schema_cache.yml file
rails db:schema:dump  # Creates a database schema file (either db/schema.rb or db/structure.sql, depending on...
rails db:schema:load  # Loads a database schema file (either db/schema.rb or db/structure.sql, depending on ...
rails db:seed # Loads the seed data from db/seeds.rb
rails db:seed:replant # Truncates tables of each database for current environment and loads the seeds
rails db:setup  # Creates all databases, loads all schemas, and initializes with the seed data (use db...
rails db:version  # Retrieves the current schema version number
rails test:db # Run tests quickly, but also reset db
```

If you want to discover all what a specific command can do, enter the `--help` flag, like this : `$> br db:migrate --help`

You will discover some nice tricks. For example:

```ruby
$> br console --help

Usage: rails console [options]

Options:
-e, [--environment=ENVIRONMENT] # Specifies the environment to run this console under (test/development/production).
-s, [--sandbox], [--no-sandbox] # Rollback database modifications on exit.

```
This sandbox option seems really cool!

Conclusion
Maybe you already heard from your sysadmin that **“the command-line is the most efficient tool”**. By using aliases for Rails, we can push this assertion a little further.
