/*  
======================================================================================================
    Template Helpers
    All Template helpers affecting the templates defined within signup.html will be placed here.
======================================================================================================
*/

Template.playLayout.helpers({
    state: function() {
        if (Meteor.user()) {
            return Meteor.user().profile.state;
        } else {
            return "meh";
        }
    },
    catchphrase: function() {
        var result;

        var index = Math.floor(Math.random() * HOME_CATCHPHRASES.length);

        if (index === 0) {
            result = false;
        } else {
            result = {
                string: "\"" + HOME_CATCHPHRASES[index] + "\""
            }
        }
        return result;
    }
});

Template.joinedmenu.helpers({
    buttontext: function() {
        var result = "";
        switch (Meteor.user().profile.state) {
            case "hosting":
            case "waiting":
                result = "Leave Lobby";
                break;
            case "drafting":
                result = "Leave Drafting";
                break;
            case "in-match":
                result = "ABANDON MATCH";
                break;
            case "pending accept":
                result = "Stop Challenge";
                break;
            default:
                result = "Stahp!";
                break;
        }
        return result;
    }
});

/*
======================================================================================================
Template Event Handlers
All Template handlers for templates defined within signup.html will be placed here
======================================================================================================
*/

Template.joinedmenu.events({
    'click #leavegame': function() {
        Meteor.call('resetState');
        if (typeof le_alert !== "undefined") {
            le_alert.close();
        }
    }
});

Template.hostmodal.events({
    'click #buttoncancel': function(evt) {
        evt.preventDefault();
        $('#hostmodal').modal('hide');
    },
    'click #buttonhost': function(evt, template) {
        evt.preventDefault();
        $('#hostmodal').modal('hide');
        var threshold = template.$('input[name="thresholdvalue"]:checked').val()
        Meteor.call('createNewGame', template.$('#gametitle')[0].value, threshold, function(err, res) {
            if (err) {
                alert(err);
            } else {
                template.$('#gametitle')[0].value = "";
            }
        });
    },
    'submit': function(evt) {
        evt.preventDefault();
    }
});

Template.playLayout.events({
    'click #joinCapt': function(evt) {
        evt.preventDefault();
        $('#hostmodal').modal('show');
    },
    'click #joinPlayer': function(evt) {
        evt.preventDefault();
        //Set player State to Ready
    },
    'click .magic': function(evt, template) {
        evt.preventDefault();
        var label = evt.currentTarget.innerHTML;
        Meteor.call('changeState', label);
    }
});

/*
======================================================================================================
Template Rendered Handlers
All Template.rendered handlers for templates defined in signup.html will be placed here
======================================================================================================
*/

Template.playLayout.rendered = function() {
    $('#hostmodal').on('shown.bs.modal', function(eve) {
        $('#gametitle')[0].focus();
    });
};

/*
======================================================================================================
Meteor Methods for Client Side
======================================================================================================
*/
Meteor.methods({
    resetState: function () {
        //Here we reset all Session variables which should be affected by resetState()
        Session.set('selectedChallenger', undefined);
    }
});
