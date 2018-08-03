var soap = require('soap');
var fs = require('fs');

var url = 'http://processing.resumeparser.com/ParsingTools.soap?wsdl';
var args = {
	product_code: '06cb79cec44eff39d7e694f443c890f0',
  	document_title: 'test_resume',
  	document_data: fs.readFileSync('attachment.txt', "utf8")
};
soap.createClient(url, function(err, client) {
  client.ParseDocNew(args, function(err, result) {
      console.log(result);
      fs.writeFile('resumeOutput.json', result, function(err) {
      	if (err) console.log("Error writing resume data to file: " + err);
      	console.log("Successfully wrote resume data to file!");
      })
  });
});

