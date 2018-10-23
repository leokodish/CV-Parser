from email.mime.text import MIMEText
import json

with open('resumeOutput.json') as f:
  data = json.load(f);

firstName = data["Results"][0]["HireAbilityJSONResults"][0]["GivenName"];
message = MIMEText("Hi " + firstName + "!\nWelcome to Quali.fit! We have received your resume and would like to welcome you to our family.")
message['to'] = "leo@quali.fit"
message['from'] = "leo@quali.fit"
message['subject'] = "Welcome to Quali.fit!"
# return {'raw': base64.urlsafe_b64encode(message.as_string())}
file = open("mime-message.txt", "w");
file.write(message.as_string());
