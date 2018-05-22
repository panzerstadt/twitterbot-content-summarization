const Algorithmia = require('algorithmia');

// takes url and outputs content summary
function urlAnalyzer(API_KEY, url_input, outputObj){

	return new Promise((resolve, reject) => {
		const client = Algorithmia.client(API_KEY);
		client.algo("web/AnalyzeURL/0.2.17").pipe(url_input).then((output) => {
			//console.log("analyzed url. result is:")
			//console.log(output.result);
			outputObj.metadata = output.result;
	
			if (output.error || output.result === null){
				console.log("ERROR!!", output.error);
				console.log("metadata from error: ", outputObj);
				reject();
			} else {
				outputObj.content = output.result.text;
				outputObj.image = output.result.thumbnail;
				outputObj.title = output.result.title;
				outputObj.content_date = output.result.date;

                let text = output.result.text;
                
                return resolve(outputObj);
			}
		});
	});
}

module.exports.urlAnalyzer = urlAnalyzer;