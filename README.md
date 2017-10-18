# Poster Board v1.1

Poster Board is an anonymous localized messaging skill developed for Amazon Alexa, which takes advantage of a reddit-like voting system to ensure users are fed the most popular and recent messages, or posts, first.  

### Video

Here is a video example of the skill in use while in development under the project name "Bort".

[![Poster Board](https://i.imgur.com/GhMeH4T.png)](https://www.youtube.com/watch?v=263e3FbNaJM)

### Changelog

**1.1**
- Changed name and invocation name of skill to "Poster Board" to prevent collision with other skills with the identical name.  Now using a unique name.
- Updated sample utterances for catchAll slot to accept recordings of posts using the 2 lines of 2 random words, 2 lines of 3 random words, up to 8 random words method in order to remove outdated catch-all methods from sample utterances

## What's a Post?

A post can be anything that a user deems important to tell others in their area.  It can be a short bit of information about something happening in the area, or it can just be a silly joke or quip.  Posting is also a verb to describe the act of sending a post.

## How to Post

If you do not have an Alexa-enabled device, visit the [Alexa Skill Testing Tool](https://echosim.io).  State "Open Poster Board" to open your Bortal to the world of Borting.  Thanks to new features with Amazon Alexa which allow you to open any Skill without first enabling, doing so is no longer necessary, but still recommended!  You can work through an optional tutorial by following voice prompts which will instruct you how exactly to use Poster Board.

### About this skill & its development

This skill was developed in Node.js using the Amazon Alexa Node SDK.  It also takes advantage of the Google Geocoding API, Amazon DynamoDB, and a simple counting API by [Stateful.co](http://www.stateful.co/).

The design for this software was done in the manner of ensuring all code is refactored into its own logical 'place' -- That is, functions directly related to the handling of voice responses by the user are in the handlers folder, all functions which assist in getting data remotely or processing that data in a way that uses several lines of code are in the helpers folder, and all constant variables are in the constants folder.  Doing this ensured that everything is easy to find and in the future I will be sure to develop in a similar manner.  Incidentally, the scope of the project changed several times through its development as I learned about the capabilities and limitations of Amazon Alexa, and as Amazon updated its Alexa device capabilities -- For example, the Alexa address API as it is currently implemented was not available previously, and plans were in place for the user to either provide a postal code or to log in to a 3rd party service to access their device location.  What started out as an idea for a simple skill which randomly plays messages from other users became an idea for a direct user-to-followers messaging social network akin to a vocal instagram or twitter, which finally became the idea which has been completed in this skill.

The use of Amazon DynamoDB was to challenge myself to learn to work with a set of code which I had no previous experience with and to maintain a completely Amazon-themed end-product.

Testing was performed primarily via the Amazon developer portal and via direct voice testing on a physical Amazon Echo Dot and [echosim.io](http://www.echosim.io).  Debugging was primarily performed using a set of console.log statements, and while this is not optimal in most circumstances, I personally found it fastest when dealing with an IOT-like device that relies on remote processing.

### About Me

I'm a new developer who is hoping to break into the web development world.  This project was created as a way to express my ability to quickly learn and work with a number of new technologies.  

### The Tech

This skill was written in NodeJS and takes advantage of Amazon's proprietary DynamoDB database system, as well as AWS's Lambda Function service.

## Contributing

Contributors are welcome!  Play with the code, submit issues, make pull requests.  Bort is open to all who are willing to Bort.

## License

Licensed under the MIT License.  View the LICENSE file for further information.
