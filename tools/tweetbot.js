const Twit = require('twit');

// set a js Date() object
function setRunTime(hour, minute) {
	var t = new Date();
	t.setHours(hour);
	t.setMinutes(minute);
	t.setSeconds(0);
	t.setMilliseconds(0);
	return t;
}

function tweetbot_tweet(CONFIG, content='test', time_to_tweet=new Date().getTime(), repeat_hourly=false) {
    
    return new Promise((resolve, reject) => {
        // this is you the twitter bot
        const T = new Twit(CONFIG);
        console.log('the bot is starting');

        // tweets the content! uses T
        function tweetIt(sentence) {

            var tweet = {
                status: sentence,
            };

            function tweeted(err, data, response) {
                console.log('tweeted: ' + tweet.status);
            }

            T.post('statuses/update', tweet, tweeted);
        }

        const tweet_to_post = content;

        const time_target = time_to_tweet;
        const time_now = new Date().getTime();
        console.log('time now is: ' + time_now);
        const timeOffset = time_target - time_now;
        console.log('will post in: '+ timeOffset + 'milliseconds');


        if (timeOffset <= 0){
            if (repeat_hourly === false){
                setTimeout(function(){
                    tweetIt(tweet_to_post);
                }, timeOffset);

                return resolve("tweetbot shutting down after 1 tweet.");
            } else {
                console.log("tweetbot will post to twitter every hour")
                setInterval(function(){
                    tweetIt(tweet_to_post);
                }, setRunTime(1, 0).getMilliseconds())
            }
        }
    })
}

module.exports.tweetbot_tweet = tweetbot_tweet;
