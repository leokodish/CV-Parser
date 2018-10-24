This is a resume retriever and parser written in Javascript and using Node.js 
In this text document is an outline of what each function does and how the program as a whole operates. 

The program works by first creating a web server that it can run the Javascript on. Once the server is created it runs "gmailScript.js" which has a "checkInbox()" function which calls functions from several other files. First it creates credentials to get proper authorization to manipulate ones Gmail account. Then when it gets down to "CollectMessages()" it uses Gmail API calls to make a request for a certain number of messages (the number of messages returned by the API call can be changed through the "maxMessages" variable). 

The program receives a response from the Gmail API and parses that response to get the messageId. It then calls the "verifyEmailAddress()" function found in "verifyEmail.js" to confirm whether the email address the message was sent from is a verified email (which emails are verified can be found/edited in "emails.json").

If the address is a verified address, then the program checks to see if it has an attachment (what should be the resume) using the "getAttachment()" function. 

If the email contains an attachment, the the program calls "getMessage()" to get the attachmentId it needs to then pass on to "getAttachment()". The response returned from the calling of "getAttachment()" is then parsed to get the base64 encoded string that represents the attachment data and writes that data into a text file called "attachment.txt". 

The function "fixAttachmentData()" is then called because in the base64 encoded string returned by the Gmail API, every instance of "-" should be "+", and every instance of "_" should be "/". So we use regular expressions to replace "-" and "_" with "+" and "/", respectively. 

Once "fixAttachmentData()" has returned and the attachmenet data has been reformatted, we now have the resume data in the form of a base64 encoded string. 

The "parseRequest()" function found in "parseCVSOAP.js" creates a SOAP request and sends it to Hireability's resume parsing service. The response it receives is then written to "resumeOutput.json" and then writes important information to the console such as the first name, last name, phone number, and email address. 

Lastly, we want to confirm to the person whose resume we have just parsed that we have received their information. To do this we send an email to them using the email address we parsed from their resume. In order to send an email using the Gmail API we need to create a MIME message which we will then encode in to a base64 encoded string. "createMimeMessage.py" is a python script that reads in "resumeOutput.json" to get the person's first name and email address. It then constructs a MIME message which it writes into "mime-message.txt". 

"sendEmail.js" reads in "mime-message.txt" and encodes it as a base64 encoded string that we can use as a parameter for the Gmail API call to send an email. 

We run the entire program on an Express web server in "app.js". In "app.js" we create the web server and once it is running (we know when this is by calling "app.listen") we run whatever script we want to run as a callback function. 

IMPORTANT: the free trial account for Hireability is currently closed, so "app.js" is currently running "sendEmail.js" to show that the end result of sending an email to the applicant works given that all of the other programs work. 

