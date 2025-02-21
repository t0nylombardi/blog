---
title: 'Image Conversion'
date: '2020-12-29'
heroImage: '/blog/image-conversion/image-conversion.jpeg'
image: '/blog/image-conversion/image-conversion.jpeg'
originalDatePublished: '2014-11-18'
description: "I wrote a script that allows me to take several images rename them, and then create two resized images in addition."
author: 'Anthony Lombardi'
categories: [ruby]
tags: [ruby]
draft: false
---

In the realm of digital content management, streamlining repetitive tasks can save invaluable time and effort. Recently, I embarked on a quest to simplify the process of renaming and resizing a batch of images. The goal was to create a script that allows me to take several images rename them, and then create two resized images. Not only does this accomplish these tasks efficiently but also ensures optimal image quality throughout the process.

## The Challenge

The initial challenge revolved around parsing through a directory of images, each with filenames in a specific format. While the images themselves had numerical identifiers, such as "1.jpg," "2.jpg," and so forth, there were instances where the filenames included additional text, like "OHV May1.jpg" or "OHV May39.jpg." This necessitated a method to extract and utilize the numerical component for renaming purposes.

## Solution Approach
To tackle this challenge, I leveraged the capabilities of Ruby 3.0 along with the mini_magick gem, a powerful tool for image processing. Here's a breakdown of the solution approach:

- **Iterative Processing**: Utilizing Ruby's Dir.glob method, the script recursively traverses through the specified directory, identifying image files and initiating the renaming and resizing operations.
- Filename Parsing: Employing regular expressions, the script extracts the numerical identifier from each filename, essential for the subsequent renaming process.
- **Renaming Images**: With the numerical identifier obtained, the script systematically renames each image file to adhere to the desired naming convention, ensuring consistency and orderliness.

- **Image Resizing**: The script employs the mini_magick gem to resize the images to predefined dimensions. Crucially, the resizing operation occurs in two stages, with the larger, higher-quality original image being used for the second resizing iteration to maintain optimal image fidelity.

### idea
I could easily just replace the order of the re-sizing, but I rather just go to the source again for quality sake(if there is one at all.)

### Code Implementation

```ruby
require 'rubygems'
require 'mini_magick'

class ImageProcessor
  THUMBNAIL_SIZE = "76x100"
  RESIZED_IMAGE_SIZE = "770x1000"
  FOLDER_PATH = "pages"

  def initialize
    @images = Dir.glob("#{FOLDER_PATH}/*").sort
  end

  def process_images
    @images.each do |image_path|
      number = extract_number(image_path)
      renamed_file = rename_image(image_path, number)

      create_thumbnail(renamed_file, number)
      create_resized_image(renamed_file, number)

      clear_console
    end
  end

  private

  def extract_number(image_path)
    File.basename(image_path).scan(/[0-9]{1,}/).first
  end

  def rename_image(image_path, number)
    new_filename = "#{FOLDER_PATH}/#{number}-large#{File.extname(image_path)}"
    File.rename(image_path, new_filename)
    new_filename
  end

  def create_thumbnail(image_path, number)
    image = MiniMagick::Image.open(image_path)
    image.resize "#{THUMBNAIL_SIZE}!"
    image.write "#{FOLDER_PATH}/#{number}-thumb.jpg"
    puts "Thumbnail created: #{number}-thumb.jpg"
  end

  def create_resized_image(image_path, number)
    image = MiniMagick::Image.open(image_path)
    image.resize "#{RESIZED_IMAGE_SIZE}!"
    image.write "#{FOLDER_PATH}/#{number}.jpg"
    puts "Resized image created: #{number}.jpg"
  end

  def clear_console
    system('clear')
  end
end

# Main
processor = ImageProcessor.new
processor.process_images

```

### Conclusion

By harnessing the power mini_magick gem, I successfully automated the process of renaming and resizing images, thereby streamlining content management workflows. This endeavor not only exemplifies the versatility of Ruby for handling such tasks but also underscores the importance of optimizing image processing methodologies for superior results. With this script in hand, managing batches of images becomes a seamless and efficient endeavor, empowering content creators to focus on their creative endeavors with confidence.
