import {Accounts} from 'meteor/accounts-base';

Meteor.startup(function() {
    Accounts.ui.config({passwordSignupFields: 'USERNAME_ONLY'});

    toastr.options = {
        "preventDuplicates": true
    }
});
