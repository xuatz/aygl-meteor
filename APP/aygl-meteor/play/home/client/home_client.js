/*  
======================================================================================================
    Template Helpers
    All Template helpers affecting the templates defined within signup.html will be placed here.
======================================================================================================
*/

Template.homelayout.helpers({
    mainpanelcontent: function() {
        var result = "";
        switch (Meteor.user().profile.state) {
            case "hosting":
                result = "homecaptainslobby"
                break;
            case "waiting":
                result = "homewaitingpage"
                break;
            default:
                result = "homemaincontent"
                break;
        }
        return result;
    },
    mainpaneltitle: function() {
        var result;
        switch (Meteor.user().profile.state) {
            case "hosting":
                result = "Captain's Lobby"
                break;
            default:
                result = "Games Awaiting Challengers"
                break;
        }
        return result;
    }
});

Template.homeprofile.helpers({
    myprofile: function() {
        return Meteor.user();
    }
});

Template.homecaptainslobby.helpers({
    lobbyinfo: function() {
        return Games.findOne({
            _id: Meteor.user().profile.room
        });
    },
    nochallengers: function(playercount) {
        var result;
        if (playercount > 0) {
            result = false;
        } else {
            result = true;
        }
        return result;
    }
});

Template.challengerprofile.helpers({
    selectedChallenger: function() {
        var result;
        var game = Games.findOne({
            _id: Meteor.user().profile.room,
            challengers: {
                $elemMatch: {
                    name: Session.get('selectedChallenger')
                }
            }
        });
        if (typeof game === "undefined") {
            Session.set('selectedChallenger', undefined);
        }

        if (typeof Session.get('selectedChallenger') !== "undefined") {
            result = _.find(game.challengers, function(challenger) {
                return (challenger.name === Session.get('selectedChallenger'));
            });
            return result;
        } else {
            return;
        }
    }
});

Template.homemaincontent.helpers({
    list_lobby_hosted: function() {
        var rowLength = 2;
        var modifiedList = [];
        var originalList = Games.find({
            state: "hosted"
        }).fetch();
        var listSize = originalList.length;
        var noOfLines = Math.floor(listSize / rowLength);
        var remainder = listSize % rowLength;

        for (var i = 0; i < noOfLines; i++) {
            var currentRow = [];
            for (var j = 0; j < rowLength; j++) {
                currentRow.push(originalList.pop());
            }
            modifiedList.push(currentRow);
        }

        if (originalList.length !== 0) {
            var currentRow = [];
            for (var k = 0; k < remainder; k++) {
                currentRow.push(originalList.pop());
            }
            modifiedList.push(currentRow);
        }
        return modifiedList;
    },
    list_lobby_waiting: function() {
        //TODO ADJUST FILTER
        return Games.find({
            state: "waiting"
        });
    },
    lobbyIsEmpty: function() {
        var result;
        if (Games.find().count() === 0) {
            result = true;
        } else {
            result = false;
        }
        return result;
    }
});

Template.lobbylistitem.helpers({
    info: function() {
        var result = {};
        /*
            Components:
             - listgroupitem : border of the list-group-item class
             - buttontext    : text on the button
             - disabled      : button disabled boolean
             - buttonclass   : class of the button
        */

        var roomId = Template.currentData()._id;
        if (Meteor.user().profile.state !== "pending accept") {
            //CASE 1: Normal (not challenging any lobby)
            result.buttontext = "CHALLENGE!";
            result.buttonclass = "btn-success";

        } else if (Meteor.user().profile.room !== roomId) {
            //CASE 2: Challenged another lobby
            result.buttontext = "CHALLENGE!";
            result.buttonclass = "btn-default"
            result.disabled = "disabled";

        } else {
            //CASE 3: Challenged this lobby
            result.buttontext = "CHALLENGE ISSUED";
            result.buttonclass = "btn-warning";
            result.listgroupitem = "challenged";
            result.disabled = "disabled";
        }

        return result;
    }
});

Template.homewaitingpage.helpers({
    gameInfo: function() {
        var result;
        result = Games.findOne({
            _id: Meteor.user().profile.room
        });
        return result;
    },
    captains: function() {
        var result = {};

        var gameObj = Games.findOne({
            _id: Meteor.user().profile.room
        });
        result.host = gameObj.host;
        result.challenger = gameObj.challengers[0];

        return result;
    },
    eligiblePlayerCount: function() {
        var result;
        result = Meteor.users.find({
            "profile.state": "ready"
        }).count() + 2;
        return result;
    },
    sufficientPlayers: function() {
        var result;
        var count = Meteor.users.find({
            "profile.state": "ready"
        }).count() + 2;
        result = (count > 9);
        return result;
    }
});



/*
======================================================================================================
Template Event Handlers
All Template handlers for templates defined within signup.html will be placed here
======================================================================================================
*/

Template.lobbylistitem.events({
    'click #challengecpt': function(evt, template) {
        evt.preventDefault();
        //Make data changes if successful
        var lobbyid = evt.currentTarget.dataset.lobbyid
        Meteor.call('challengecpt', lobbyid);
    }
});

Template.homecaptainslobby.events({
    'click .clickable': function(evt, template) {
        evt.preventDefault();
        //element manipulation
        if (_.contains(evt.currentTarget.classList, "active")) {
            Session.set('selectedChallenger', undefined);
            evt.currentTarget.classList.remove('active');
        } else {
            Session.set('selectedChallenger', evt.currentTarget.id);
            template.$('.clickable').removeClass('active');
            evt.currentTarget.classList.add('active');
        }
    },
    'click #acceptchallenge': function() {
        Meteor.call('createAlert', 'challengeAccepted', Session.get('selectedChallenger'));
    }
});

Template.homewaitingpage.events({
    'click #initiateDraft': function (evt, template) {
        //CALL A METEOR METHOD TO INITIATE GRAB PLAYERS AND TRY FOR DRAFT
    }
});
