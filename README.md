# twitterbot
A wrapper for the Twitter Node module that allows you to recieve tweets in real time

##Requirements
Twitter >= 1.3.0

Twitter API keys

##Usage
```javascript
var twitterbot = require("./twitterbot.js");

// We will be receiving tweets sent to @NodeJS
var client = new twitterbot("NodeJS", {
  consumer_key: 'YOUR API KEY',
  consumer_secret: 'YOUR API SECRET',
  access_token_key: 'YOUR ACCESS TOKEN',
  access_token_secret: 'YOUR ACCESS TOKEN SECRET'
});

// For example, a Tweet is sent that says:
// @NodeJS is cool!
client.command("is", function(msg){
  console.log(msg); // Will print 'cool!'
});
```

##Limitations
This module is current not viable for high traffic Twitter accounts, as only one tweet is parsed every ten seconds. 
