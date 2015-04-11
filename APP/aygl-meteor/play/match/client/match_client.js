Meteor.subscribe('MatchesCollection');

Template.matchradiant.helpers({
    getRadPlayers: function() {
        var data = MatchesCollection.findOne();

        // console.log('===================');
        // console.log(data);

        var radPlayers = _.filter(data.matchPlayerResults,
            function(item) {
                return item.playerSlot < 5;
            }
        );

        var radPlayers = _.sortBy(radPlayers, function(item) {
            return item.playerSlot;
        });

        // console.log('radPlayers: ' + radPlayers);
        // console.log('radPlayers: ' + radPlayers[0].username);

        return radPlayers;
    }
});

Template.matchdire.helpers({
    getDirePlayers: function() {
        var data = MatchesCollection.findOne();

        // console.log('===== getDirePlayers!! ==============');
        // console.log(data);

        var players = _.filter(data.matchPlayerResults,
            function(item) {
                return item.playerSlot > 4;
            }
        );

        var players = _.sortBy(players, function(item) {
            return item.playerSlot;
        });

        return players;
    }
});

var getPlayerSlotOfLoginUser = function() {
    var matchDetails = MatchesCollection.findOne();

    var player = _.find(matchDetails.matchPlayerResults,
        function(item) {
            return item.username === Meteor.user().username;
        }
    );

    if (player) {
        return player.playerSlot;
    } else {
        throw Error("Username is not in the draft!!!");
    }
}

//TODO DT: the client should know which game the player is currently in, persistantly
// var theGame = findOne({
//     _id: "currentGameId"
// });

//TODO DT: the game document should generate a password upon "Draft Completion"

Template.matchlayout.helpers({
    // should the client have access to the game they are currently playing?
    // or should the control be handled by the server?
    // im leaning towards first method
    theGame: function() {
        return Games.findOne();
    },
    hasReportedResult: function(resultReports) {
        return checkIfPlayerReportedResult(resultReports, Meteor.user().username);
    }
});

Template.matchlayout.events({
    'click #matchRadWin' : function(event) {
        event.preventDefault();

        if (!Session.get('resultReported')) {
            bootbox.confirm("Are you sure?", function(result) {
                if (result) {
                    var clickedBtn = $(event.target);
                    clickedBtn.addClass('btn-success');

                    var sibling1 = $(event.target).next('a');
                    sibling1.removeClass('btn-info');

                    var sibling2 = sibling1.next('a');
                    sibling2.removeClass('btn-danger');

                    //TODO hardcoded for dev
                    var gameId = '12';

                    Meteor.call('updatePlayerResultReport', gameId, Meteor.user().username, getPlayerSlotOfLoginUser(), 'R');

                    Session.set('resultReported', true);
                }
            });
        }
    },
    'click #matchVoid' : function(event) {
        event.preventDefault();

        if (!Session.get('resultReported')) {
            bootbox.confirm("Are you sure?", function(result) {
                if (result) {
                    var clickedBtn = $(event.target);
                    clickedBtn.addClass('btn-info');

                    var sibling1 = $(event.target).prev('a');
                    sibling1.removeClass('btn-success');

                    var sibling2 = $(event.target).next('a');
                    sibling2.removeClass('btn-danger');

                    //TODO hardcoded for dev
                    var gameId = '12';

                    Meteor.call('updatePlayerResultReport', gameId, Meteor.user().username, getPlayerSlotOfLoginUser(), 'R');

                    Session.set('resultReported', true);
                }
            });
        }
    },
    'click #matchDireWin' : function(event) {
        event.preventDefault();

        if (!Session.get('resultReported')) {
            bootbox.confirm("Are you sure?", function(result) {
                if (result) {
                    var clickedBtn = $(event.target);
                    clickedBtn.addClass('btn-danger');

                    var sibling1 = $(event.target).prev('a');
                    sibling1.removeClass('btn-info');

                    var sibling2 = sibling1.prev('a');
                    sibling2.removeClass('btn-success');
                    
                    //TODO hardcoded for dev
                    var gameId = '12';
                    // is it Meteor.user().profile.room????
                    // den room == match._id
                    // so use some helper to get the game._id

                    Meteor.call('updatePlayerResultReport', gameId, Meteor.user().username, getPlayerSlotOfLoginUser(), 'R');

                    Session.set('resultReported', true);
                }
            });
        }
    }
});

Template.playerPanel.events({
    'click #thumbsUp' : function(event) {
        event.preventDefault();
        var something = $(event.target);

        // console.log(something);

        if (something.hasClass( "text-success" ) ) {
            something.removeClass('text-success');
            //TODO DT
            //user.commend--;
        } else {
            something.addClass('text-success');
            //TODO DT
            //user.commend++;
            var siblingThumbsDown = $(event.target).next('i');
            if (siblingThumbsDown.hasClass("text-danger") ) {
                siblingThumbsDown.removeClass('text-danger');
                //TODO DT
                //user.report--;
            }
        }

        // bootbox.prompt({
        //     title: this.username + " best player ever. Rated 10/10",
        //     callback: function(result) {
        //         if (result === null) {
        //             console.log('he left nothing');
        //         } else {
        //             console.log('are you sure?');
        //             //TODO save comments to commend
        //         }
        //     }
        // });
    },
    'click #thumbsDown' : function(event) {
        event.preventDefault();
        var something = $(event.target);

        // console.log(something);
        // console.log('=================');

        if (something.hasClass( "text-danger" ) ) {
            something.removeClass('text-danger');
            //TODO
            //user.report--;
        } else {
            something.addClass('text-danger');
            //TODO
            //user.report++;

            var previousThumbsUp = $(event.target).prev('i');
            if (previousThumbsUp.hasClass("text-success") ) {
                previousThumbsUp.removeClass('text-success');
                //TODO
                //user.commend--;
            }
        }

        // bootbox.prompt({
        //     title: "omg " + this.username +  ", S A D B O Y S",
        //     callback: function(result) {
        //         if (result === null) {
        //             console.log('he left nothing');
        //         } else {
        //             console.log('are you sure?');
        //             //TODO save comments to commend
        //         }
        //     }
        // });
    }
});
