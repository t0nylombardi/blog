---
title: 'Creating a Pixel Tracker with NextJS and Prisma (2022)'
date: '2022-10-31T20:37:52.538Z'
heroImage: '/blog/nextjs-pixel-tracker/nextjs-pixel-tracker.jpeg'
originalDatePublished:
description: 'An updated version of Pixel Tracking with NextJS and Prisma'
author: 'Anthony Lombardi'
image: 'https://images.unsplash.com/photo-1579616043939-95d87a6e8512'
categories: [nextjs]
tags: [nextjs]
draft: false
---

Several thousand years ago I wrote about tracking pixels and how to implement it in Ruby on Rails using the Rack to collect data and store it into an api.  Here I am going to replicate the same thing using NextJS and Prisma.


If you are sending out content to your customers, or a need to track viewership on a webpage, it’s pretty handy to know if the content is loading. I speak as if you are sending out emails, newsletters, ads, etc or tracking a webpage. If you have ever sent out an email newsletter from a service like MailChimp, you would have seen email open graphs. If you have used Google Analytics, you would have seen something similar. Of course, tracking this stuff is super important for a campaign, but it would also be interesting to see if users are seeing your content.


## The idea
The simplest way to do this is via a tracking pixel – a small, invisible image that is loaded from your server every time your medium is opened. This is fairly simple to achieve using Rails by building a simple Rack application. Picture you are creating ads for clients and you are sending them out to ad shops. If you are using a program like Google Doubleclick. Google DoubleClick allows you to track your ad through a pixel tracking url. This data can be gathered to figure out trends when those ads, emails, or newsletters are being opened.


## The Setup


```
npx create-next-app@latest —typescript
```


This will give you a prompt of what to call the app.


Next, you will set up Prisma and connect it to your PostgreSQL database. Start by installing the Prisma CLI via npm:
```
npm install prisma —save-dev
```


Now, you can use the Prisma CLI to bootstrap a basic Prisma setup using the following command:
```
npx prisma init
```


Open the **.env** file and replace the dummy connection URL with the connection URL of your PostgreSQL database.
```
// .env
DATABASE_URL="postgresql://t0nylombardi@localhost:password1:5432/pixel?schema=public"
```


 ### Create your database schema with Prisma


```javascript
// schema.prisma


generator client {
 provider = "prisma-client-js"
}


datasource db {
 provider = "postgresql"
 url      = env("DATABASE_URL")
}


model Pixel {
 id           String  @id @default(cuid())
 ip_address   String
 campaign     String
 content_type String
 city         String
 state        String
 user_agent   String
}
```


To actually create the tables in your database, you now can use the following command of the Prisma CLI:

```
npx prisma db push
```


### Install Prisma client

Before you can access your database from Next.js using Prisma, you first need to install Prisma Client in your app. You can install it via npm as follows:

```shell
npm install @prisma/client
```

Because Prisma Client is *tailored* to your own schema, you need to update it every time your Prisma schema file is changing by running the following command:

```shell
npx prisma generate
```

You’ll use a single PrismaClient instance that you can import into any file where it’s needed. The instance will be created in a prisma.ts file inside the lib/ directory. Go ahead and create the missing directory and file:

```shell
mkdir lib && touch lib/prisma.ts
```

```javascript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
 prisma = new PrismaClient();
} else {
 if (!global.prisma) {
   global.prisma = new PrismaClient();
 }
 prisma = global.prisma;
}

export default prisma;
```

## The Pixel Tracker.

NextJS allows you to gather info via requests through their Api Routes.


### Create an Api Route

```shell
mkdir pages/api && touch pages/api/tracker.ts
```

Add the following boilerplate code and we will walk through what we need from it:

```javascript
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
 name: string
}

export default function handler(
 req: NextApiRequest,
 res: NextApiResponse<Data>
) {
 res.status(200).json({ name: 'John Doe' })
}
```

Most of what we need from here is the request `req` We will change what is returned shortly as well.

First we want to gather anything in the query string after the URL:

```
example.com/api/tracker?campaign=SomeCampaign&content_type=blog
```


```javascript
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
 name: string
}

export default function handler(
 req: NextApiRequest,
 res: NextApiResponse<Data>
) {
 query: { campaign, content_type }
} = req;

res.status(200).json({ name: 'John Doe' })
```

Next we want to gather info about the request. Ip address, and user_agent inside the handler


```javascript
.
.
.
const forwarded = req.headers["x-forwarded-for"]
const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress
const user_agent = req.headers['user-agent']

```

The following is to send the IP address to an api to get the location back:


```javascript

let headers = new Headers({
  "Accept"       : "application/json",
  "Content-Type" : "application/json",
  "User-Agent"   : "keycdn-tools:https://localhost"
});

let locationData  = await fetch(`https://tools.keycdn.com/geo.json?host=${ip}`, {
  method  : 'GET',
  headers : headers
})
.then((response) => {
  return response.json();
})
.then((json) => {
  return json.data.geo
});

```

Next thing is to do is save to the database:

```javascript

 // Create new Pixel
 await prisma.pixel.create({
   data: {
     ip_address: `${locationData.host}`,
     campaign: `${campaign}`,
     content_type: `${content_type}`,
     city: `${locationData.city}`,
     state: `${locationData.region_code}`,
     user_agent: `${user_agent}`,
   },
 });

```

The Last thing we want to do is return a 1x1 pixel:

```javascript
.
.
.
res.setHeader('Content-Type', 'image/jpg')
res.send(imageBuffer)
}
```


## conclusion

There you have it, I’ve created a 1x1 pixel and put it in a folder of the root directory. This could be made many different ways and could be googled to figure that out. I'm sure there is a purely JS way of generating a pixel on the fly. We've created a way to track user interactions with a pixel the same way Google Analytics, MailChimp and the like track interactions.

### Repo:

[Aries Pixel](https://github.com/t0nylombardi/ariesPixel)
