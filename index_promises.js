// based on this tutorial
// https://www.youtube.com/watch?v=7-nX3YOC4OA&index=4&list=PLRqwX-V7Uu6atTSxoRiVnSuOn6JHnq2yV

// uses twit package
// https://github.com/ttezel/twit


// import libraries
const Twit = require('twit');
const config = require('./config');
const Algorithmia = require('algorithmia');
const googleNLP = require('./tools/google-nlp');

// Algorithmia API key
const API_KEY = "simhFhidXPbHSy2ybtT7c+UB+Nr1";

// empty output object to fill
const outputObj = {};

outputObj.timestamp = new Date().toString



// IN
// get content
//TODO: automatically traverse website and grab content
// 1. already setup ec2 instance server (http://www.datasciencetoolkit.org/developerdocs#setup)
//    - server: data-science-toolkit-personal
// 2. connect to ec2 server through an API: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
// 3. install the jquery plugin (found from js doc in dstk) (copy paste a js file into your project folder)

// process content

// GOOGLE NATURAL LANGUAGE API
// all async
// googleNLP.analyze_sentiment(json_content.content);
// googleNLP.classify_content(json_content.content);
// googleNLP.analyze_entities(json_content.content);

// ALGORITHMIA
// grab content from website, and then summarize it
//const summarized_content;
// Algorithmia.client(API_KEY)
//     .algo("util/Html2Text/0.1.6")
//     .pipe(architasters_website_input)
// 	.then(function(output) {
// 		console.log('page content extracted. (TODO: a bit dirty, try other APIs)');
// 		console.log(output);
// 		console.log(typeof(output))
// 		console.log(output['result'])
// 		const summarizer_input = output.result;

// 		console.log('summarizing content from page');
// 		Algorithmia.client(API_KEY)
// 			.algo("nlp/Summarizer/0.1.7")
// 			.pipe(summarizer_input)
// 			.then(function(output) {
// 				console.log(output)
// 			});
// 	});

// takes url and outputs summary of text found in URL
// Algorithmia.client("simhFhidXPbHSy2ybtT7c+UB+Nr1")
//     .algo("nlp/SummarizeURL/0.1.4")
//     .pipe(architasters_website_input)
//     .then(function(output) {
//         console.log(output);
// 	});
	

// IN
// --------------------
// opt1: a page from architasters
const architasters_website_input = "http://architasters.com/ideas/la-tourette/";
// opt2: json input text
const json_content = require('./json_content.json');

tweet_post_time = [20, 45];
tt = tweet_post_time;

// PROCESS
const website_url = architasters_website_input
// takes url and outputs content summary
Algorithmia.client("simhFhidXPbHSy2ybtT7c+UB+Nr1")
    .algo("web/AnalyzeURL/0.2.17")
    .pipe(architasters_website_input)
    .then(function(output) {
		//console.log(output);
		
		const wb = output.result;

		const website_content = wb.text;
		const website_access_timestamp = wb.date;
		const website_image_thumbnail = wb.thumbnail;
		const website_title = wb.title;

		// parse_googleNLP(website_content)
		// 	.then((output) => {
		// 		console.log('this is googles result back in index.js');
		// 		console.log(output);
		// 	});

		const text = website_content;

		// this is a promise linked to a variable
		const sentiment = googleNLP.analyze_sentiment(text, sentences=true, magnitude_threshold=0.6);
		const classify = googleNLP.classify_content(text);
		const entities = googleNLP.analyze_entities(text, top_10=true);

		const google_promises = [
			sentiment, classify, entities
		]

		Promise.all(google_promises).then((output) => {
			console.log('index js here!');
			console.log(output)
		});
		
		
	});


// produces a tweet to be posted
tweet_to_post = 'hello world testing again!!';


// OUT
// --------------------

// this is you the twitter bot
const T = new Twit(config);
console.log('the bot is starting');


// calculate time and set timer for posting the tweet
const time_target = setRunTime(tt[0], tt[1]).getTime();
const time_now = new Date().getTime();
console.log('time now is: ' + time_now);
const timeOffset = time_target - time_now;
console.log('will post in: '+ timeOffset + 'milliseconds');

// three async API requests to googleNLP
function parse_googleNLP(text) {
	return Promise.all([
		googleNLP.analyze_sentiment(text, sentences=true, magnitude_threshold=0.6),
		googleNLP.classify_content(text),
		googleNLP.analyze_entities(text, top_10=true)
	]).then(([result1, result2, result3]) => {result1, result2, result3});
}

// decides when to tweet
function setRunTime(hour, minute) {
    var t = new Date();
    t.setHours(hour);
    t.setMinutes(minute);
    t.setSeconds(0);
    t.setMilliseconds(0);
    return t;
}

// tweets the content!
function tweetIt(sentence) {

	var tweet = {
		status: sentence,
	};

	function tweeted(err, data, response) {
		console.log('tweeted: ' + tweet.status);
	}

	T.post('statuses/update', tweet, tweeted);
}

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




// if (timeOffset >= 0){
//     setTimeout(function(){
//         tweetIt(tweet_to_post);
//     }, timeOffset);
// }