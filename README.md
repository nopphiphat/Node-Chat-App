# Node Chat Application Website

Andrew Mead - The Complete Node.js Developer Course

## Description

Created a chat application using Node.js, Express, Socket.io, Bad-words, Mustache, Moment, and QS. The chat app uses the Socket.io library so that users can join a room and chat with individuals in that specific room. Current features include: join a room, send messages in that room in bidirectional ways, as well as send geolocation information. When users enter or exit the room, the room list updates and an Admin message is broadcast to the users in that room. Additional features that could be added includes adding a list of current active rooms where other user can pick and join, and making the username and room names unique and case-insensitive.

## Deployed

The application is deployed on Heroku, [https://nopi-chat-app.herokuapp.com/](https://nopi-chat-app.herokuapp.com/). User can utilize the website and start chatting with their friends in their specific room, and even send each other their location. 

## Installing

After downloading or cloning the repo, execute the following steps:

1) Open the project folder at the root in your terminal and run `npm install` to download the necessary dependencies needed for this project.

2) Run `npm run start` to run the Express server which defaults to localhost:3000. Alternatively, run `npm run dev` to enter development mode.

## Built With

- [Node.js](https://nodejs.org/en/) - JavaScript runtime
- [Express](https://expressjs.com/en/4x/api.html#express) - Server Framework
- [bad-words](https://www.npmjs.com/package/bad-words) - Filtering out offensive words
- [mustache](https://www.npmjs.com/package/mustache) - For rendering logic-less template
- [moment](https://www.npmjs.com/package/moment) - JavaScript date library for parsing, validating, manupulating, and formatting dates.
- [qs](https://www.npmjs.com/package/qs) - querystring parsing
- [Heroku](https://dashboard.heroku.com/apps) - Deployment platform

## Re-creator

- **Nopphiphat Suraminitkul** - [Github](https://github.com/nopphiphat)

## Acknowledgements

- **Andrew Mead**, at [mead.io](https://mead.io/), who made this excellent Node.js course on [Udemy](https://www.udemy.com/the-complete-nodejs-developer-course-2/)

