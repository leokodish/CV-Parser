const express = require('express')
const app = express()
const gmailScript = require('./gmailScript.js')

app.listen(3000, () => console.log('Example app listening on port 3000!'))

//create an event listener that will watch my Gmail inbox

app.get('/', (req, res) => gmailScript.data.checkInbox( function() {
	console.log('Successfuly checked Gmail inbox!'); 
}))



