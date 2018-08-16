var fs = require('fs');
var readline = require('readline');
var {google} = require('googleapis');
var parser = require('./parseCVSOAP.js');

var methods = {

    checkInbox: function(callback) {

        // If modifying these scopes, delete client_secret.json.
        var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
        var TOKEN_PATH = 'credentials.json';

        // Load client secrets from a local file.
        fs.readFile('client_secret.json', (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Gmail API.
            authorize(JSON.parse(content), collectMessages);
        });

        /**
         * Create an OAuth2 client with the given credentials, and then execute the
         * given callback function.
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


        /**
         * Get and store new token after prompting for user authorization, and then
         * execute the given callback with the authorized OAuth2 client.
         * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
         * @param {getEventsCallback} callback The callback for the authorized client.
         */
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


        function collectMessages(auth) {
            var gmail = google.gmail({version: 'v1', auth});
            //number of messages to be returned by the API call to the Gmail inbox
            var maxMessages = 1;
            gmail.users.messages.list({
                userId: 'me', 
                maxResults: maxMessages,
            }, (err, res) => {
                if (err) return console.log('The API returned an error: ' + err);
                //run through all of the messages returned and check for attachments
                for (var i = 0; i < maxMessages; i++) {
                    var messageId = res.data.messages[i].id;
                    checkEmailAddress(gmail, messageId, function(verifiedEmailAddress) {
                        if (verifiedEmailAddress) {
                            hasAttachment(gmail, messageId, function(containsAttachment) {
                            //if there's an attachment, write it to 'attachment.txt' and send for parsing
                            if (containsAttachment) {
                                getMessage(gmail, messageId, function(attachmentId) {
                                    getAttachment(gmail, messageId, attachmentId, function(res) {
                                        // //write the data to an external text file that will be sent to CV parser
                                        var filename = 'attachment.txt';
                                        fs.writeFile(filename, res.data.data, (err) => {
                                            if (err) return console.log('Error while writing to file: ' + err);
                                            //need to edit the base64 encoded string since Gmail's API returns the string with "-" and "_" where "+" and "/" should be, respectively
                                            fixAttachmentData(filename, function() {
                                                //ocall parseRequest script from parseCV.js to parse CV and output into resumeOutput.json
                                                // parser.data.parseRequest( function(err) {
                                                //     if (err) return console.log('Could not parse the file: ' + err);
                                                // });
                                                callback();
                                            });
                                        })
                                    })
                            })   
                        }
                    });
                }   
            });
        }

        //check whether the address the email came from is that of a clients
        function checkEmailAddress(gmail, messageId, callback) {
            
        }

        //check whether a given message contains an attachment
        function hasAttachment(gmail, messageId, callback) {
            gmail.users.messages.get({
                'userId': 'me',
                'id': messageId
            }, (err, res) => {
                if (err) return console.log("There was an error: " + err);
                var containsAttachment = false;
                var attachmentCheck = res.data.payload.parts[1].body.attachmentId;
                if (typeof attachmentCheck != 'undefined') {
                    containsAttachment = true;
                }
                callback(containsAttachment);
            });
            
        }

        //gets the attachmentId necessary to access the attachment data 
        function getMessage(gmail, messageId, callback) {
            gmail.users.messages.get({
                'userId': 'me',
                'id': messageId
            }, (err, res) => {
                if (err) return console.log("There was an error: " + err);
                var attachmentId = res.data.payload.parts[1].body.attachmentId;
                callback(attachmentId);
            });
        }

        //gets attachment data in the form of a base64 encoded string
        function getAttachment(gmail, messageId, attachmentId, callback) {
            //GET request returns a response containing the attachment data as an base64 encoded string
            gmail.users.messages.attachments.get({
                userId: 'me',
                messageId: messageId,
                id: attachmentId,
            }, (err, res) => {
                if (err) return console.log('The API returned an error: ' + err);
                callback(res);
            });
        }

        //fixes the base64 encoded string returned by the Gmail API into a usable format 
        function fixAttachmentData(filename, callback) {
            //encode string as utf8 otherwise fs.readFile removes "-" or "_"
            fs.readFile(filename, 'utf8', (err, content) => {
                var encodedString = content;
                //replace all instances of "-" with "+"
                var updatedString = encodedString.replace(/-/g, '+');
                //replace all instances of "_" with "/"
                var fixedString = updatedString.replace(/_/g, '/');

                //update 'attachment.txt' file with the fixed base64 encoded string
                fs.writeFile(filename, fixedString, (err) => {
                    if (err) console.log("There was an error: " + err);
                    console.log("Successfully wrote fixed string to file");
                    callback();
                });
            });
        }
    }
}

exports.data = methods;

