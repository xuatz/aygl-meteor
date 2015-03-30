/*
    Subscriptions for Alerts module
*/
myalerts = Meteor.subscribe('myalerts');


/*
======================================================================================================
Bootstrap Notify
Below are the Alerts which will be used by this app.

Bootstrap Notify v3.0.0 has the following 2 JSONS when calling alerts

- OPTIONS
- SETTINGS

======================================================================================================
*/

renderAlert = function(alert) {
    var options = {};
    var settings = {};
    // Check to ensure alert does not already exist
    if ($('[data-notify]#challengeAccepted_' + alert._id).length > 0) {
        console.log('Repeated Alert!');
        return;
    }

    //Generate the OPTIONS & SETTINGS obj
    switch (alert.category) {
        case "challengeAccepted":
            //Options
            options = {
                message: " has accepted your challenge!",
                icon: "fa fa-shield fa-5x text-warning"
            };
            //Settings
            settings = {
                animate: {
                    enter: "animated fadeInDown",
                    exit: "animated zoomOut"
                },
                placement: {
                    from: "top",
                    align: "center"
                },
                type: "info",
                allow_dismiss: false,
                delay: 0,
                offset: {
                    y: 150
                },
                template: Blaze.toHTMLWithData(Template.alertChallengeAccepted, alert),
                onShow: function() {
                    //Set up listener for the buttons.
                    //NOTE: This listener will be destroyed once the notification is closed.
                    $('#acceptChallenge_' + alert._id).on('click', function(evt) {
                        evt.preventDefault();
                        Meteor.call('respondToAlert', alert._id, "accepted");
                        $('[data-notify], #challengeAccepted_' + alert._id).find('[data-notify="dismiss"]').trigger('click');
                    });
                    $('#rejectChallenge_' + alert._id).on('click', function(evt) {
                        evt.preventDefault();
                        Meteor.call('respondToAlert', alert._id, "rejected");
                        Meteor.call('resetState');
                        $('[data-notify], #challengeAccepted_' + alert._id).find('[data-notify="dismiss"]').trigger('click');
                    });
                }
            };
            break;
        default:
            console.log('Unrecognized Alert. Dang it!');
            return false;
            break;
    }

    //Send the notification to user!
    $.notify(options, settings);
}

/*
======================================================================================================
Alert Handler
Keeps track of new alerts and handles them accordingly
======================================================================================================
*/
//Start the Alert Handler service here
Tracker.autorun(function() {
    if (myalerts.ready()) {
        var initme = true;
        myalerts_handle = Alerts.find().observe({
            added: function(document) {
                if (!initme) {
                    //Handle NEW incoming alerts
                    renderAlert(document);
                } else {
                    //Handle EXISTING, POSSIBLY unread alerts
                    //NOT USED FOR NOW
                }
            },
            changed: function(newDoc, oldDoc) {
                if (oldDoc.needResponse !== newDoc.needResponse &&
                    newDoc.response === "timeout") {
                    Meteor.call('resetState');
                    $('[data-notify], #' + newDoc.category + '_' + alert._id).find('[data-notify="dismiss"]').trigger('click');
                }
            }
        });
        initme = false;
    }
});
