const express = require('express');
const app = express()
const email = require('./sendEmail.js');
// const gmailscript = require('./gmailscript.js');

//create web server upon which we can run our scripts
var server = app.listen(3000, function() {
	console.log('Example app listening on port 3000!');
	email.data.sendEmail( function() {
		console.log("draft completed");
		setTimeout(function() {
			server.close();
		}, 3000);
	})
})
	







