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
    },
    heroesList: function() {
        var arr = dota2assets.heroes;

        //$("#hero3").select2("val", "axe");

        return _.toArray(arr);
    },
    doc2: function() {
        return Meteor.users.findOne();
    }
});

Template.registerHelper("optionsRole", function() {
    return [
        
    ];
});

Template.updateUserForm.helpers({
    doc: function() {
        return Meteor.users.findOne().profile.matchmaking;
    },
    options: function() {
        return {
            2013: "2013",
            2014: "2014",
            2015: "2015"
        }
    },
    mySchema: function() {
        return Schemas.ProfileMatchmaking;
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
                result = "Leave Match Lobby";
                break;
            case "pending accept":
                result = "Stop Challenge";
                break;
            case "ready":
                result = "Leave Player Pool";
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
    'click #btnGenericExit': function() {
        Meteor.call('resetState');
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
        Meteor.call('joinPool');
    },
    'click .magic': function(evt, template) {
        evt.preventDefault();
        var label = evt.currentTarget.innerHTML;
        Meteor.call('changeState', label);
    },
    'click #playerPreferences': function(evt) {
        evt.preventDefault();

        bootbox.dialog({
            title: "Personal Preferences",
            message: "<div id='dialogNode'></div>",
            onEscape: function() {}
        });
        Blaze.render(Template.updateUserForm,$("#dialogNode")[0]);
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
    // $('#hero1').select2({
    //     width: "180px"
    // });
};

/*
======================================================================================================
Meteor Methods for Client Side
======================================================================================================
*/
Meteor.methods({
    resetState: function() {
        //Here we reset all Session variables which should be affected by resetState()
        Session.set('selectedChallenger', undefined);
    },
    editPreferences: function(doc) {
        check(doc, Schemas.ProfileMatchmaking);
        bootbox.hideAll();
    }
});

Tracker.autorun(function() {
    if (Meteor.user() &&
        _.contains(['waiting', 'drafting'], Meteor.user().profile.state)) {
        var gameObj = Games.findOne({
            _id: Meteor.user().profile.room
        });

        subscription_getEligiblePlayers = Meteor.subscribe('getEligiblePlayers', gameObj.lobbyPercentile);
        if (Meteor.user().profile.state === 'waiting' &&
            typeof eligiblePlayerMonitor === 'undefined' &&
            Meteor.user().username === gameObj.host.name) {
            //Start the eligible player monitoring method if host

        } else if (Meteor.user().profile.state === 'drafting' &&
            typeof eligiblePlayerMonitor !== 'undefined' &&
            Meteor.user().username === gameObj.host.name) {
            //Stop the eligible player monitoring method if host

        }
    } else if (typeof subscription_getEligiblePlayers !== 'undefined') {
        subscription_getEligiblePlayers.stop();
    }
});
