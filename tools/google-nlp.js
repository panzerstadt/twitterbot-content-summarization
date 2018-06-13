const debug = false;

// Imports the Google Cloud client library
const language = require('@google-cloud/language');

// Instantiates a client
const client = new language.LanguageServiceClient();

// below are promised functions
function analyze_sentiment(input_text, sentences=false, magnitude_threshold=0.5){
    
    return new Promise((resolve, reject) => {

        // The text to analyze
        const text = input_text;

        // make the bunch of settings to put into API call
        const document = {
        content: text,
        type: 'PLAIN_TEXT',
        };

        // run googleNLP API for text sentiment
        client
        .analyzeSentiment({document: document})
        .then(results => {
            const output = {}

            //console.log(results)
            // document level
            const doc_sentiment = results[0].documentSentiment;

            if (text.length >= 100) {
                full_text_length = text.length;
                preview_text = `${text.slice(0,100)}...(${full_text_length} characters)`;
            }
            else {
                preview_text = text;
            }

            if (debug == true) {
                console.log("\nperforming sentiment analysis over entire text")
                console.log(`Text: ${preview_text}`);
                console.log(`Sentiment score: ${doc_sentiment.score}`);
                console.log(`Sentiment magnitude: ${doc_sentiment.magnitude}`);
                console.log("-"*100);
            }
            

            output.document = {};  //because nested keys are not possible
            output.document.sentiment = doc_sentiment.score;
            output.document.magnitude = doc_sentiment.magnitude;
            

            //sentence level (optional)
            if (sentences === true) {
                const sen_sentiment = results[0].sentences;
                output.sentences = [];

                if (debug == true) {
                    console.log("-"*100);
                    console.log("\nperforming sentiment analysis per sentence")
                }
                
                sen_sentiment.forEach(sentence => {
                    // filter only sentences that have strong sentiment, normalized by magnitude
                    // score = final sentiment, normalized, from -1 to 1
                    // magnitude = amount of emotion, not normalized, from 0.0 to +inf
                    // magnitude of 0 == emotionless
                    // magnitude / num_of_words = normalized_emotion
                    const sen_content = sentence.text.content;
                    const sen_magnitude = sentence.sentiment.magnitude;
                    const sen_score = sentence.sentiment.score;
                    const sen_word_count = sen_content.split(" ").length;

                    // 0.5 is arbitrary
                    if (sen_magnitude <= magnitude_threshold) {}
                    else {

                        if (debug == true) {
                            console.log(sen_content);
                            console.log('magnitude: ' + sen_magnitude);
                            console.log('normalized magnitude: ' + (sen_magnitude/sen_word_count));
                            console.log('score: ' + sen_score);
                        }

                        output.sentences.push({
                            'sentence': sen_content,
                            'magnitude': sen_magnitude,
                            'norm_magnitude': sen_magnitude / sen_word_count,
                            'score': sen_score
                        })
                    }
                })
            }
            
            return resolve(output);
        })
        .catch(err => {
            console.error('ERROR:', err);
            reject('GOOGLE API CALL ERROR');
            });

    })

}

function classify_content(input_text){

    return new Promise((resolve, reject) => {
        // the text to analyze
        const text = input_text;

        // Prepares a document, representing the provided text
        const document = {
            content: text,
            type: 'PLAIN_TEXT',
        };
        
        // Classifies text in the document
        client
            .classifyText({document: document})
            .then(results => {
            const classification = results[0];
            
            if (debug == true) {
                console.log("-"*100);
                console.log("\nperforming content classification");
                console.log('Categories:');
                classification.categories.forEach(category => {
                    console.log(
                    `Name: ${category.name}, Confidence: ${category.confidence}`
                    );
                });
                console.log("-"*100);
            }

            return resolve(classification);

            })
            .catch(err => {
                console.error('ERROR:', err);
                reject('GOOGLE API CALL ERROR');
                });
    })

}

function analyze_entities(input_text, top_10=true){

    return new Promise((resolve, reject) => {
        // the text to analyze
        const text = input_text;

        // Prepares a document, representing the provided text
        const document = {
            content: text,
            type: 'PLAIN_TEXT',
        };
        
        // Detects entities in the document
        client
            .analyzeEntities({document: document})
            .then(results => {
            let entities = results[0].entities;

            if (top_10 === true) {
                entities = entities.slice(0, 10);
            }
            
            if (debug == true) {
                console.log("-"*100);
                console.log("\nlisting main entities in text:")
                console.log('Entities:');
                entities.forEach(entity => {
                    console.log(entity.name);
                    console.log(` - Type: ${entity.type}, Salience: ${entity.salience}`);
                    if (entity.metadata && entity.metadata.wikipedia_url) {
                        console.log(` - Wikipedia URL: ${entity.metadata.wikipedia_url}$`);
                        }
                });
                console.log("-"*100);
            }
            
            return resolve(entities);

            })
            .catch(err => {
                console.error('ERROR:', err);
                reject('GOOGLE API CALL ERROR');
                });
    })

}

module.exports.analyze_sentiment = analyze_sentiment;
module.exports.classify_content = classify_content;
module.exports.analyze_entities = analyze_entities;