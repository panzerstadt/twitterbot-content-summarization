const debug = true;
// based on this tutorial
// https://www.youtube.com/watch?v=7-nX3YOC4OA&index=4&list=PLRqwX-V7Uu6atTSxoRiVnSuOn6JHnq2yV

// uses twit package
// https://github.com/ttezel/twit

// learn promises here
// https://javascript.info/promise-chaining
// learn Promise.all here
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all

// IMPORT
const config = require('./config');  // change this to set different twitter accounts
const API_KEY = config.algorithmia.api_key;
const TWITTER_CONFIG = config.twitter;

const googleNLP = require('./tools/google-nlp');
const tweetbot = require('./tools/tweetbot');
const algorithmia = require('./tools/algorithmia');

// definitions
// sort
function sortBy(field, reverse, primer){

	var key = primer ? 
		function(x) {return primer(x[field])} : 
		function(x) {return x[field]};

	reverse = !reverse ? 1 : -1;

	return function (a, b) {
		return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
	} 
}

// set a js Date() object
function setRunTime(hour, minute) {
	var t = new Date();
	t.setHours(hour);
	t.setMinutes(minute);
	t.setSeconds(0);
	t.setMilliseconds(0);
	return t;
}

function createDateAsUTC(date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
}



// creates tweet content
function buildTweet(){

	return new Promise((resolve, reject) => {
		console.log("checking outputObj");
		console.log(outputObj);

		// produces a tweet to be posted
		tweet_to_post = 'hello world testing again!!' + new Date().getTime().toString();
		outputObj.tweet = tweet_to_post;
		return resolve(tweet_to_post);
	})
}

// INPUTS
// opt1: a page from architasters
const architasters_website_input = "http://architasters.com/ideas/la-tourette/";
// opt2: json input text
const json_content = require('./json_content.json');
// final url used
const website_url = architasters_website_input

// SETTINGS
tweet_post_time = [20, 45];

// timer
let time_target = new Date().getTime();
if (debug == false) {
	// the real timer
	// calculates how long to wait before first post
	tt = tweet_post_time;
	const time_target = setRunTime(tt[0], tt[1]).getTime();
}

// DEFINE EMPTY BOX
const outputObj = {};
// this is the global object to fill
// when callback is done, throw it into this object

// TIMESTAMP
outputObj.timestamp = createDateAsUTC(new Date());

// RUN THROUGH ALGORITHMS
algorithmia.urlAnalyzer(API_KEY, website_url, outputObj)
.then(() => {
	return new Promise((resolve, reject) => {
		let text = outputObj.content;
		// this is a promise linked to a variable
		// google nlp requires text from here, so they have to be
		// in the then() function from the algorithmia api
		console.log("running google nlp");
		const sentiment = googleNLP.analyze_sentiment(text, sentences=true, magnitude_threshold=0.6);
		const classify = googleNLP.classify_content(text);
		const entities = googleNLP.analyze_entities(text, top_10=true);

		const google_promises = [
			sentiment, 
			classify, 
			entities
		]

		Promise.all(google_promises)
		.then((output) => {
			if (output.error || output.result === null){
				reject("google nlp ERROR!!", output.error);
			} else {
				console.log('google nlp performed on text');
				//console.log(output);
				outputObj.nlp = output;

				return resolve(output);  
				// resolve is super important
				// if you don't put resolve, once js
				// gets to the end of the file it
				// executes the next one without waiting to resolve
			}
		})
		.catch(err => {
			reject("one or more google nlp promises not fulfilled");
		});
	})
})
.then(() => {buildTweet()})
.then(() => {
	// tweet it
	tweetbot.tweetbot_tweet(TWITTER_CONFIG, outputObj.tweet, time_target, repeat_hourly=false);
	// save it
	if (debug == true) {
		console.log("saving content to json")
		var fs = require('fs');
		fs.writeFile("test_output_obj.json", JSON.stringify(outputObj), function(err) {
			if (err) {
				console.log(err);
			}
		});
	}
})
// then(s) have to have a function, it cannot call a function as a variable
// even it it is a blank function, it needs to be defined in order to get it
// to wait



