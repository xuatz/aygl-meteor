/*  
======================================================================================================
    Template Helpers
    All Template helpers affecting the templates defined within signup.html will be placed here.
======================================================================================================
*/

Template.homeprofile.helpers({
    myprofile: function() {
        return Meteor.user();
    }
});

Template.homecaptainslobby.helpers({
    info: function() {
        return Games.findOne({
            lobby_id: Meteor.user().room
        });
    }
});

Template.challengerprofile.helpers({
    selectedChallenger: function() {
        return Meteor.users.findOne({
            username: Session.get('selectedChallenger')
        });
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
        var lobbyid = evt.target.dataset.lobbyid
        Meteor.call('challengecpt', lobbyid);
    }
});
