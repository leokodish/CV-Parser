
$(document).ready(function() {
    $('#myForm').ajaxForm({
        dataType: 'json',
        complete: function (response) {
            var firstName = response.responseJSON.Results[0].HireAbilityJSONResults[0].GivenName;
            var lastName = response.responseJSON.Results[0].HireAbilityJSONResults[0].FamilyName;
            var emailAddress = response.responseJSON.Results[0].HireAbilityJSONResults[0].Email[0].Address;
            var phoneNumber = response.responseJSON.Results[0].HireAbilityJSONResults[0].Phone[0].Number;

            console.log("First Name: " + firstName);
            console.log("Last Name: " + lastName);
            console.log("Email: " + emailAddress);
            console.log("Phone Number: " + phoneNumber);
        }
    })
})



