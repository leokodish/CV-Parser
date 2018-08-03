var fs = require('fs');
var request = require('request');


var methods = {

    parseRequest: function (filename, callback) {

        var form = {
            document: fs.createReadStream(__dirname + '\\' + filename),
            product_code: "06cb79cec44eff39d7e694f443c890f0"
        };

        request.post({
            url: 'http://processing.resumeparser.com/requestprocessing.html',
            formData: form
        }, function (err, httpResponse, body) {
            if (err) {
                callback(err);
            }
            fs.writeFile('resumeOutput.json', body, function(err) {
                if (err) console.log('Error writing to output file: ' + err);
                console.log('Succesfully wrote to file!');
            });
        });
    }
}

exports.data = methods;




//         var form = {
//             product_code: "06cb79cec44eff39d7e694f443c890f0",
//             document_title: 'attachment',
//             document: fs.createReadStream(__dirname + '/attachment.txt')
//         };

//         request.post({
//             url: 'http://processing.resumeparser.com/requestprocessing.html',
//             formData: form
//         }, function (err, httpResponse, body) {
//             if (err) throw err;
//             fs.writeFile('resumeOutput.json', body, function(err) {
//                 if (err) {
//                     console.log('Error writing to output file: ' + err);
//                 }
//             });
// })




