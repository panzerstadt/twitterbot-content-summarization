debug = false;

function readTime(content) {
    //ref https://blog.medium.com/read-time-and-you-bc2048ab620c
    /*
    Read time is based on the average reading speed of an adult 
    (roughly 275 WPM). We take the total word count of a post and 
    translate it into minutes. Then, we add 12 seconds for each 
    inline image. Boom, read time.
    */
    let content_word_count = content.split(" ").length;
    const words_per_minute = 275;

    // inline image not taken into consideration yet
    let read_time = content_word_count / words_per_minute;

    if (debug === true) {
        console.log("article word count: "+ content_word_count);
        console.log("calculated readtime in mins: "+ read_time);
    }

    return parseInt(read_time);
}

module.exports.readTime = readTime;