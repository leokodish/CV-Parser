var http = require('http');
var inboxListener = require('./inboxListener.js');



//create a server object:
http.createServer(function (req, res) {
	inboxListener.data.runInboxWatchScript( function(err) {
		if (err) console.log("Error while trying to watch Gmail inbox: " + err);
		gmailScript.data.getAndParseResume( function(err) {
			if (err) console.log("Error while trying to get/parse attachment from Gmail: " + err);
			console.log("Successfuly parsed resume!");
		});
	});
}).listen(8080); //the server object listens on port 8080

