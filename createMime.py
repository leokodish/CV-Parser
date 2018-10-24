from email.mime.text import MIMEText
import json

#read in JSON containing parsed resume data
with open('resumeOutput.json') as f:
  data = json.load(f);

firstName = data["Results"][0]["HireAbilityJSONResults"][0]["GivenName"];
emailAddress = data["Results"][0]["HireAbilityJSONResults"][0]["Email"][0]["Address"];

#construct MIME message 
message = MIMEText("Hi " + firstName + "!\nWelcome to Quali.fit! We have received your resume and would like to welcome you to our family.")
message['to'] = "leo@quali.fit" #change this to emailAddress to send the email to the email parsed from resume
message['from'] = "leo@quali.fit"
message['subject'] = "Welcome to Quali.fit!"

#write the MIME message to "mime-message.txt"
file = open("mime-message.txt", "w");
file.write(message.as_string());
