var fs = require('fs');
var readline = require('readline');
var {google} = require('googleapis');
var parser = require('./parseCVSOAP.js');
var emailList = require('./emails.json');


// If modifying these scopes, delete client_secret.json.
var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
var TOKEN_PATH = 'credentials.json';

// Load client secrets from a local file.
fs.readFile('client_secret.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Gmail API.
    authorize(JSON.parse(content), getMessage);
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

function getMessage(auth) {
    var gmail = google.gmail({version: 'v1', auth});
    //number of messages to be returned by the API call to the Gmail inbox
    var maxMessages = 1;
    gmail.users.messages.list({
        userId: 'me', 
        maxResults: maxMessages,
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        for (var i = 0; i < maxMessages; i++) {
            var messageId = res.data.messages[i].id;
            gmail.users.messages.get({
                userId: 'me',
                id: messageId
            }, (err, res) => {
                if (err) return console.log('The API returned an error while trying to retrieve message: '+ err);
                //look through structured email data to find email address the message was sent from
                var emailAddress = "";
                for (j = 0; j < res.data.payload.headers.length; j++) {
                    if (res.data.payload.headers[j].name === ('From')) {
                        emailAddress = res.data.payload.headers[j].value;
                        break;
                    }
                }
                verifyEmailAddress(emailAddress);
            })
        }
    })
}

function verifyEmailAddress(emailAddress) {
    //emailAddress string is in the format of 'Name of user' <email address>' will need to be parsed to get just email address                        emailAddress = res.data.payload.headers.length[j].value;
    var start = emailAddress.indexOf('<');
    var end = emailAddress.indexOf('>');
    emailAddress = emailAddress.substring(start + 1, end);

    //run through json containing list of verified emails and check to see if the email address is one of them
    var isVerified = false;
    for (i = 0; i < emailList.verifiedEmails.length; i++) {
        if (emailAddress === emailList.verifiedEmails[i]) {
          console.log('Email Matches!');
          isVerified = true;
        } 
    }

    if (!isVerified) {
        console.log('Email is not a verified email address');
    }
}
