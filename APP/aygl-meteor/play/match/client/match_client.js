Meteor.subscribe('MatchesCollection');

//TODO DT: the game document should generate a password upon "Draft Completion"





var getSelectedMatch = function() {
    console.log('start of getSelectedMatch()');
    console.log('Player state: ' + Meteor.user().profile.state);

    var matchId = Meteor.user().profile.room;
    console.log(matchId);

    var m = MatchesCollection.findOne({
        _id : matchId
    })

    //hardcoded for dev purposes
    if (!m) {
        m = MatchesCollection.findOne();
    }

    console.log(m);

    return m;
}

var getSelectedGame = function() {
    console.log('start of getSelectedGame()');
    var m = getSelectedMatch();

    if (!m) {
        return null;
    } else {
        var gameId = m.gameId;

        if (!gameId) {
            return null;
        } else {
            var g = Games.findOne({
                _id: gameId
            })

            //hardcoded for dev purposes
            if (!g) {
                g = Games.findOne();
            }

            console.log(g);

            return g;
        }
    }
}

Template.matchradiant.helpers({
    getRadPlayers: function() {
        var m = getSelectedMatch();

        // console.log('===================');
        // console.log(m);

        var radPlayers = _.filter(m.matchPlayerResults,
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
        var m = getSelectedMatch();

        // console.log('===== getDirePlayers!! ==============');
        // console.log(m);

        var players = _.filter(m.matchPlayerResults,
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

Template.matchlayout.helpers({
    selectedMatch: function() {
        return getSelectedMatch();
    },
    selectedGame: function() {
        //actual implmentation return getSelectedGame();
        return Games.findOne(); //hardcoded for dev
    },
    hasReportedResult: function() {
        if (Session.get('resultReported')) {
            return true;
        } else {
            return false;
        }

        //below is the more "accurate implementation, but above is a cheaper implementation"
        //return checkIfPlayerReportedResult(resultReports, Meteor.user().username);
    }
});

Template.matchlayout.events({
    'click leaveLobby': function(event) {
        event.preventDefault();
        //TODO leave lobby function

        //update the player's state to ???
        //update the player's room to ???
        //Session.set('resultReported', false);
    },
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

                    Meteor.call('updatePlayerResultReport', 'R');
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

                    Meteor.call('updatePlayerResultReport', 'V');
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

                    Meteor.call('updatePlayerResultReport', 'D');
                    Session.set('resultReported', true);
                }
            });
        }
    }
});

Template.playerPanel.events({
    'click #thumbsUp' : function(event, template) {
        event.preventDefault();
        var item = $(event.target);
        var item2 = $(event.currentTarget);

        var username = template.data.username;

        // console.log(template.find('.member-name').innerHTML);
        // console.log(template.data.username);

        if (item.hasClass( "text-success" ) ) {
            item.removeClass('text-success');

            Meteor.call('increaseUserThumbsUpCount', username, false); 
        } else {
            item.addClass('text-success');

            Meteor.call('increaseUserThumbsUpCount', username, true);
            var siblingThumbsDown = $(event.target).next('i');
            if (siblingThumbsDown.hasClass("text-danger") ) {
                siblingThumbsDown.removeClass('text-danger');
                
                Meteor.call('increaseUserThumbsDownCount', username, false);
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
    'click #thumbsDown' : function(event, template) {
        event.preventDefault();
        var item = $(event.target);
        var username = template.data.username;

        if (item.hasClass( "text-danger" ) ) {
            item.removeClass('text-danger');
            
            Meteor.call('increaseUserThumbsDownCount', username, false); //down--
        } else {
            item.addClass('text-danger');
            Meteor.call('increaseUserThumbsDownCount', username, true); //down++

            var previousThumbsUp = $(event.target).prev('i');
            if (previousThumbsUp.hasClass("text-success") ) {
                previousThumbsUp.removeClass('text-success');

                Meteor.call('increaseUserThumbsUpCount', username, false); //up--
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

//XZ:23/4/15 - cowdown timer proof of concept

var count = 0;
var draftTimeLeft = DRAFT_PICK_PLAYER_DURATION + BONUS_PREP_TIME;

//timer ticks every 1s
var timer = new Chronos.Timer(1000); //in ms, divide by 1000 to get time in seconds

var resetDraftingTime = function() {
    timer.stop();
    count = 0;
    draftTimeLeft = DRAFT_PICK_PLAYER_DURATION + BONUS_PREP_TIME;
    timer.start();
}

Template.timer.onRendered(function() {
    console.log('hi im being rendered!');
    resetDraftingTime();
});

Template.timer.helpers({
    time: function () {
        //get the timer ticking
        console.log('tick tock');

        timer.time.get();
        draftTimeLeft--;

        if (draftTimeLeft >= 30) { // this is so that the browser gt time to render shit before countdown begins
            return 30;
        } else {
            if (draftTimeLeft === 0) {
                timer.stop();

                //====================

                // var havenPickPlayer = false; //TODO insert logic
                // if (havenPickPlayer) {
                //     
                // }

                //====================          

                // var gameId = "something"; //TODO
                // var username = "some name"; //TODO

                // Meteor.call('endOfCurrentDraftingTurn', gameId, username, function(err, res) {
                //     if (res) {
                //         switchDraftingSide(res);
                //     }
                // });

                return null;
            } else {
                return draftTimeLeft;
            }
        }
    }   
});





//XZ: sample code for countdown : 21/4/15 - end

