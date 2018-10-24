var fs = require('fs');
var readline = require('readline');
var {google} = require('googleapis');
var Base64 = require('js-base64').Base64;



var methods = {

	sendEmail: function(callback) {
		
		// If modifying these scopes, delete client_secret.json.
		var SCOPES = ['https://www.googleapis.com/auth/gmail.modify'];
		var TOKEN_PATH = 'token.json';

		// Load client secrets from a local file.
		fs.readFile('client_secret.json', (err, content) => {
		    if (err) return console.log('Error loading client secret file:', err);
		    // Authorize a client with credentials, then call the Gmail API.
		    authorize(JSON.parse(content), sendEmail);
		    callback();
		});

		/**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
		 * Create an OAuth2 client with the given credentials, and then execute the
		 * given callback function.il
		 * @param {Object} credentials The authorization client credentials.
		 * @param {function} callback The callback to call with the authorized client.
		 */
		function authorize(credentials, callback) {
		    var {client_secret, client_id, redirect_uris} = credentials.installed;
		    var oAuth2Client = new google.auth.OAuth2(
		        client_id, client_secret, redirect_uris[0]);

		    // Check if we have previously stored a token.
		    fs.readFile(TOKEN_PATH, (err, token) => {
		        if (err) return getNewToken(oAuth2Client, callback);
		        oAuth2Client.setCredentials(JSON.parse(token));
		        callback(oAuth2Client);
		    });
		}


		 // *
		 // * Get and store new token after prompting for user authorization, and then
		 // * execute the given callback with the authorized OAuth2 client.
		 // * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
		 // * @param {getEventsCallback} callback The callback for the authorized client.
		 
		function getNewToken(oAuth2Client, callback) {
		    var authUrl = oAuth2Client.generateAuthUrl({
		        access_type: 'offline',
		        scope: SCOPES,
		    });
		    console.log('Authorize this app by visiting this url:', authUrl);
		    var rl = readline.createInterface({
		        input: process.stdin,
		        output: process.stdout,
		    });
		    rl.question('Enter the code from that page here: ', (code) => {
		        rl.close();
		        oAuth2Client.getToken(code, (err, token) => {
		            if (err) return callback(err);
		            oAuth2Client.setCredentials(token);
		            // Store the token to disk for later program executions
		            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
		                if (err) return console.error(err);
		                console.log('Token stored to', TOKEN_PATH);
		            });
		            callback(oAuth2Client);
		        });
		    });
		}

		//use the mime message string created by createMime.py to create a Gmail message draft
		function sendEmail(auth) {
			fs.readFile("mime-message.txt", 'utf8', (err, content) => {
				var base64encodedEmail = Base64.encodeURI(content);
				var gmail = google.gmail({version: 'v1', auth});
		   		gmail.users.messages.send({
		        	userId: 'me',
		        	resource: {
		        			raw: base64encodedEmail
		  
		        	}

		    	}, function(err, res) {
		        if (err) return console.error(err);
		        	console.log(res);
		    	});
			})
		}
	}
}

exports.data = methods;