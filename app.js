const express = require('express');
const app = express()
const email = require('./sendEmail.js');

var server = app.listen(3000, function() {
	console.log('Example app listening on port 3000!');
	email.data.sendEmail( function() {
		console.log("draft completed");
		setTimeout(function() {
			server.close();
		}, 3000);
	})
})
	







