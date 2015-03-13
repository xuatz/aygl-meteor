/*  
======================================================================================================
    Template Helpers
    All Template helpers affecting the templates defined within signup.html will be placed here.
======================================================================================================
*/

Template.homeLayout.helpers({
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
                result = "Leave Match";
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
    }
});

Template.homesidecontent.events({
    'click #testnotification': function(evt) {
        evt.preventDefault();
        shownotification(Meteor.user().username);
    }
});

Template.homeLayout.events({
    'click #joinCapt': function(evt) {
        evt.preventDefault();
        $('#hostmodal').modal('show');
    },
    'click #joinPlayer': function(evt) {
        evt.preventDefault();
        //Set player State to Ready
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
        Meteor.call('createNewGame', template.$('#gametitle')[0].value, function(err, res) {
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

Template.lobbylistitem.events({
    'click #challengecpt': function(evt, template) {
        evt.preventDefault();
        //Make data changes if successful
        var lobbyid = evt.target.dataset.lobbyid
        Meteor.call('challengecpt', lobbyid);
    }
});

/*
======================================================================================================
Template Rendered Handlers
All Template.rendered handlers for templates defined in signup.html will be placed here
======================================================================================================
*/

Template.homeLayout.rendered = function() {
    $('#hostmodal').on('shown.bs.modal', function(eve) {
        $('#gametitle')[0].focus();
    });
};