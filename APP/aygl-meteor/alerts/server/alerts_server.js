/*
	Error Definitions for Alerts
*/
alert_error_001_NO_SUCH_CATEGORY = new Meteor.Error('Alert_Err_001', 'No such category!');
alert_error_002_ALERT_INVALID = new Meteor.Error('Alert_Err_002', 'This alert is not valid!');
alert_error_003_MISSING_INFO = new Meteor.Error('Alert_Err_003', 'Alert is missing critical information!');
alert_error_004_REPEATED_ALERT = new Meteor.Error('Alert_Err_004', 'Alert already exists! Stahp!');
alert_error_005_UNAUTHORIZED_RESPONSE = new Meteor.Error('Alert_Err_005', 'You are not authorized to respond to this alert!');
alert_error_006_ALERT_NEEDS_NO_ACK = new Meteor.Error('Alert_Err_006', 'This alert does not require a response!');

/*
	Server side method definitions
*/

Meteor.methods({
    respondToAlert: function(alertId, response, timeoutId) {
        /*
        	Check to ensure the response is coming from the recipient and is awaiting
        	a response.
        */

        var alertObj = Alerts.findOne({
            _id: alertId
        });
        if (alertObj.recipient !== Meteor.user().username) {
            throw alert_error_005_UNAUTHORIZED_RESPONSE;
        } else if (!alertObj.needResponse) {
            throw alert_error_006_ALERT_NEEDS_NO_ACK;
        }

        //Carry on with responding to Alert

        Alerts.update({
            _id: alertId
        }, {
            $set: {
                needResponse: false,
                response: response
            }
        });

        //Take action
        switch (alertObj.category) {
            case "challengeAccepted":
                console.log('Doing Something about Challenge');
                break;
            default:
                statements_def
                break;
        }
    },
    createAlert: function(category, recipient, data) {
        //Check if this alert is allowed and generate the alert to be inserted
        var result = Meteor.call('generateAlert', category, recipient);

        //Insert the alert
        if (Alerts.find(result).count() !== 0) {
            throw alert_error_004_REPEATED_ALERT;
        }
        result.timestamp = new Date();
        Alerts.insert(result);
        if (result.needResponse) {
            Meteor.setTimeout(function() {
                //Check if needed to take action
                var checkme = Alerts.findOne(result);
                if (typeof checkme !== "undefined" &&
                    checkme.needResponse) {
                    Alerts.update(result, {
                        $set: {
                            needResponse: false,
                            response: 'timeout'
                        }
                    });
                }
            }, 5000);
        }
    },
    generateAlert: function(category, recipient, data) {
        var result = {};

        if (typeof category === "undefined" ||
            typeof recipient === "undefined") {
            throw alert_error_003_MISSING_INFO;
        }

        //Sets default values. Subject to change below
        result.category = category;
        result.recipient = recipient;
        if (!Meteor.user()) {
            result.sender = 'system';
        } else {
            result.sender = Meteor.user().username;
        }
        /*
        		remaining fields:
        		 - needResponse
        		 - data
        		 - type

        		 these only need to be filled in if your alert handler
        		 requires them. otherwise they are ok to be left blank.
        	*/

        switch (category) {
            case "challengeAccepted":
                //check for game exist and in right state
                var room = Games.findOne({
                    _id: Meteor.user().profile.room,
                    state: "hosted"
                });
                if (typeof room === "undefined" ||
                    room.host.name !== Meteor.user().username ||
                    _.filter(room.challengers, function(challenger) {
                        return challenger.name === recipient
                    }).length !== 1) {
                    throw alert_error_002_ALERT_INVALID;
                }

                //Generate challengeAccepted-specific fields
                result.needResponse = true;

                break;
            default:
                throw alert_error_001_NO_SUCH_CATEGORY;
                break;
        }

        return result;
    },
    meth1: function() {
        console.log(this);
        console.log(Meteor.user());
    }
});
