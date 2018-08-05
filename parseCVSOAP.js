var soap = require('soap');
var fs = require('fs');

// var url = 'http://processing.resumeparser.com/ParsingTools.soap?wsdl';
// var args = {
// 	product_code: '06cb79cec44eff39d7e694f443c890f0',
//   	document_title: 'test_resume',
//   	document_data: fs.readFileSync('attachment.txt', "utf8")
// };
// soap.createClient(url, function(err, client) {
//   client.ParseDocNew(args, function(err, result) {
//       fs.writeFile('resumeOutput.json', result.return.$value, function(err) {
//       	if (err) console.log("Error writing resume data to file: " + err);
//       	console.log("Successfully wrote resume data to file!");
//       })
//   });
// });


fs.readFile('resumeOutput.json', function(err, body) {
    if (err) {
        console.error(err);
    }
    var data = JSON.parse(body);
    console.log('First name: ' + data.Results[0].HireAbilityJSONResults[0].GivenName);
    console.log('Last name: ' + data.Results[0].HireAbilityJSONResults[0].FamilyName);
    console.log('Phone Number: ' + data.Results[0].HireAbilityJSONResults[0].Phone[0].Number);
    console.log('Email Address: ' + data.Results[0].HireAbilityJSONResults[0].Email[0].Address);
})