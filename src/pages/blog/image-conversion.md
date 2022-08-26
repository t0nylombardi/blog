---
layout: '../../layouts/BlogLayout.astro'
title: 'Image Conversion'
date: '2020-12-29'
coverImage: ''
originalDatePublished: '2014-11-18'
description: "I wrote a script that allows me to take several images rename them, and then create two resized images in addition."
author: 't0nylombardi'
image: 'https://images.unsplash.com/photo-1655720035861-ba4fd21a598d'
categories: ruby
tags: ruby
---

I wrote a script that allows me to take several images rename them, and then create two resized images in addition. The specifics of the naming and re-sizing convention required me to name each image as:

```
1.jpg
2.jpg
3.jpg
etc.....
```

The file name comes up as a string “OHV May1.jpg” and so on. Recursively parsing through the images came up with a hurtle. In the array of the directory the list would show:

```
OHV May39.jpg
OHV May4.jpg
OHV May40.jpg
```

So I simply grabbed the number from the string and renamed it from that variable.

The next to parts where I create the two re-sized images, They needed to named a certain way. The second I created a new variable so the resize can come from the original file which is bigger and better quality. The First run I did make I went from original image(big) to small back to big. This made the third image pixelated and blurry obviously. I could easily just replace the order of the re-sizing, but I rather just go from the source again just for quality sake if there is one at all.

Here is the code:

```ruby
require 'rubygems'
require 'mini_magick'

@sizes = [ "76x100", "770x1000" ]

# puts "Script complete.\n\n"
folder_path = "pages"
Dir.glob(folder_path + "/*").sort.each do |f|
   number = f.scan(/[0-9]{1,}/)

    #rename first
    filename = File.basename(f, File.extname(f))
    renamed_file = "#{folder_path}/"+number[0].to_s+"-large"+File.extname(f)
    File.rename(f, renamed_file)

    # prints image its working on
    puts "imaging: "+number[0]+File.extname(f)
    file = number[0]+File.extname(f)

    # creates 76x100 thumb
    ri = MiniMagick::Image.open(renamed_file)
    ri.resize "#{@sizes[0]}!"
    ri.write "#{folder_path}/#{File.basename(file, '.jpg')}-thumb.jpg"
    printf("%25s - %s\n", "Created: ", "#{File.basename(file, '.jpg')}-thumb.jpg")

    # creates 770x1000
    ri2 = MiniMagick::Image.open(renamed_file)
    ri2.resize "#{@sizes[1]}!"
    ri2.write "#{folder_path}/#{File.basename(file, '.jpg')}.jpg"
    printf("%25s - %s\n", "Created: ", "#{File.basename(file, '.jpg')}.jpg")

    system('clear')
end

```
