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
    'click #challengecpt': function (evt, template) {
        evt.preventDefault();
        //Change Status to Pending Accept
        //Add user details to Challengers List
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

shownotification = function(name) {
    $.growl({
        message: "You've been matched up! Click to meet your Team!",
        title: '<strong>Yay, ' + name + '!</strong>',
        icon: 'fa fa-users fa-lg'
    }, {
        animate: {
            enter: "animated bounceInLeft",
            exit: "animated bounceOutRight"
        },
        placement: {
            from: "top",
            align: "center"
        },
        type: 'success',
        offset: {
            y: 150
        },
        template: '\
<div data-growl="container" class="alert col-xs-4" role="alert">\
    <button type="button" class="close" data-growl="dismiss">\
        <span aria-hidden="true">×</span>\
        <span class="sr-only">Close</span>\
    </button>\
    <span data-growl="icon"></span> - \
    <span data-growl="title"></span> : \
    <span data-growl="message"></span>\
    <a href="#" data-growl="url"></a>\
</div>'
    });
}
