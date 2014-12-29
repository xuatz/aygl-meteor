/*
======================================================================================================
Server Methods
Methods used by during the Signup process will be placed here
======================================================================================================
*/

Meteor.methods({
        checkValidSignup: function(siggy) {
            if (VerifyTab.findOne({
                    sig: siggy
                }) === undefined) {
                return false;
            } else {
                return VerifyTab.findOne({
                    sig: siggy
                });
            }
        },
        registrationComplete: function(siggy) {
            VerifyTab.remove({
                sig: siggy
            });
        }
    });