// creates tweet content
function buildTweet(outputObj){

	return new Promise((resolve, reject) => {
		console.log("checking outputObj");
		console.log(outputObj);

		// produces a tweet to be posted
		tweet_to_post = 'hello world testing again!!' + new Date().getTime().toString();
		//outputObj.tweet = tweet_to_post;
		return resolve(tweet_to_post);
	})
}

module.exports.buildTweet = buildTweet;