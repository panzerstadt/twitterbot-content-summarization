//TODO: auto traverse webpage and grab stuff
// https://scotch.io/tutorials/scraping-the-web-with-node-js
// https://dev.to/aurelkurtula/introduction-to-web-scraping-with-nodejs-9h2
// https://github.com/cheeriojs/cheerio
// https://medium.com/@nickey_vee/web-scraping-with-node-js-509b65d9e5d0
// https://medium.com/@designman/building-a-performant-web-scraper-in-node-js-5f4449674163

var request = require('request');
var cheerio = require('cheerio');

website = 'http://architasters.com/essays/looking-east/';

website_html = request(website, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //console.log('body:', body); // Print the HTML for the Google homepage.

    // DOM traversal with cheerio (like beautifulsoup)
    const $ = cheerio.load(body);
    var title, date, content;

    var content_json = {
        title: "",
        date: "",
        content: ""
    };

    // start checking from the class thing called .ast-container
    $('.ast-container').filter(function(){
        const data = $(this);

        console.log(data);

        content_json.title = '';
        content_json.content ='';
    });

    


});
