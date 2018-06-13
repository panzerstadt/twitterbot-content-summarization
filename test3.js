const debug = false;

const readtime = require('./tools/readtime');

const outputObj = require("./test_output_obj.json");

const current_date = new Date(outputObj.timestamp);
const content_date = new Date(outputObj.metadata.date);

const time_diff = (current_date - content_date);

function dateMention() {
    let date_mention = ''
    // how the hell do i find time differences in JS
    if (time_diff <= 4286000) {
        date_mention = 'recent'
    } else {
        date_mention = 'latest'
    }
    return date_mention
}

function entityMention() {
    return outputObj.entities[0].name;
}

function lengthMention() {
    return readtime.readTime(outputObj.content);
}

function linkMention() {
    return outputObj.metadata.url;
}

function hashtagsMention() {
    //todo: make the hashtag recommendation algorithm
    return '#architasters';
}

function quoteMention(random_from_top_10=true) {
    // take the sentence with the strongest emotions that is within 140 characters
    const quote_list = outputObj.sentiment.sentences;
    const short_quote_list = []
    quote_list.forEach(element => {
        if (element.sentence.length <= 140) {
            short_quote_list.push(element.sentence)
        }
    });

    if (debug == true) {
        console.log('top 3 quotes');
        short_quote_list.slice(0,3).forEach(element => {
            console.log(element);
        });
    }

    let output;
    if (random_from_top_10 == true) {
        let r_index = parseInt(Math.random()*10-1);
        console.log('random sentence is: '+ r_index);
        output = short_quote_list[r_index];
    } else {
        output = short_quote_list[0];
    }

    return output;
}

function emojiMention() {
    // todo: have a set of whitelisted emoji
    return 'some whitelisted emoji'
}


t1 = `Take a look at our ${ dateMention() } article about ${ entityMention() }! (${ lengthMention() } min read) ${ linkMention() } ${ hashtagsMention() }`;
t2 = `${ quoteMention() } ${ emojiMention() } ${ hashtagsMention() }`;

let content_to_post = t2;
console.log(content_to_post + ` -> ${content_to_post.length} characters`);

outputObj.tweet = content_to_post;

//console.log(outputObj);

// todo:
/*
1. get the sentence with the highest emotional content and that is <= 140 characters
2. save 23 characters for links (url shortening causes it to be 23 chars)
3. compose tweet with

outputObj

let date_mention = ''
if (outputObj.content_date <= 2 weeks before) {
    date_mention = 'recent'
} else {
    date_mention = 'latest'
}

let entity_mention = ''

// TYPE 1
// uses content_date, content length, entity_mention
`Take a look at our { date_mention } article about { entity_mention }! ({ length_mention } min read) { link }`
`{ hashtags_mention }`

// TYPE 2
`{ quote } { emoji } { hashtag }`
*/



