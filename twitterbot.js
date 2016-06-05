// Require Twitter module
const twitter = require('twitter');

// Define list of triggers, username, last tweet, and interval object :
triggers = [];
username = "";
interval = null;
lastTweet = "";

// Constructor
function twitterbot(user, options) {
  // Check for null user
  if(user === "" || user === null) {
    throw new Error('Username undefined');
  }
  // Set username
  username = user;
  // Instantiate twitter object
  client = new twitter(options);
  // Grab the last tweet sent to our user
  client.get('search/tweets', {q: 'from:' + username}, function(error, tweets, response) {
    // Check for errors in query
    if(tweets.errors !== undefined) {
      console.log("Oops! Twitter returned an error");
      return;
    }
    if(tweets.statuses === undefined) {
      return;
    }
    // Set the last tweet
    lastTweet = tweets.statuses[0].text;
    // Conform the last tweet by removing the first two words
    lastTweet = lastTweet.split(' ').slice(2, lastTweet.length).join(' ');
    // Start calling our checkTwitter function every 10 seconds, after an inital wait of 10 seconds
    setTimeout(function(){
      interval = setInterval(checkTwitter, 10000);
    }, 10000);
  });
}

// Internal Function checkTwitter :
// Interval function. Called every x seconds (As not to excede the maxium API requests).
function checkTwitter(){
  // Get the tweet
  client.get('search/tweets', {q: 'to:' + username}, function(error, tweets, response) {
    // Check for errors in query & empty reponse
    if(tweets.errors !== undefined) {
      console.log("Oops! Twitter returned an error");
    }
    if(tweets.statuses === undefined) {
      return;
    }
    tweet = tweets.statuses[0].text;

    // Dissasemble the tweet
    tweet = tweet.split(' ');
    // Loop through trigger words
    for(var i = 0; i < triggers.length; i++) {
      // Compare trigger word to tweet command. Case insensitive
      if(triggers[i][0].toLowerCase() == tweet[1].toLowerCase()) {
        // Remove the first two 'arguments' from the tweet
        tweet = tweet.slice(2, tweet.length);
        // Rejoin the tweet into a string
        tweet = tweet.join(' ');
        // Check if the tweet the same as our previous tweet
        if(tweet == lastTweet){
          return;
        }
        // Initiate callback
        triggers[i][1](tweet);
      }
    }
  // Set the tweet to lastTweet
  lastTweet = tweet;
  });
}

// Prototypes :
// Command function
twitterbot.prototype.command = function (command, callback) {
  triggers[triggers.length] = [command, callback]; // Append the command the the callback to the trigger list
};
// Export Module :
module.exports = twitterbot;