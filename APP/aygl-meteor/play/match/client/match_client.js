Meteor.subscribe('MatchesCollection');
Meteor.subscribe('PlayerReview');

//TODO DT: the game document should generate a password upon "Draft Completion"

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
        return getUserRoomObject();
    },
    selectedGame: function() {
        return getSelectedGame(getUserRoomObject().gameId);
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

var checkIfReviewingYourself = function (username) {
    if (Meteor.user().username === username) {
        return true;
    } else {
        return false;
    }
}

Template.playerPanel.events({
    'click #thumbsUp' : function(event, template) {
        event.preventDefault();

        if (checkIfReviewingYourself(template.data.username)) {
            console.log("You are reviewing urself!");
        } else {

            var pr = Session.get('playerReviews');

            if (!pr) {
                pr = new Array(10);
            }

            if (pr[template.data.playerSlot]) {
                //already review this player
            } else {
                bootbox.prompt({
                    title: this.username + " best player ever. Rated 10/10",
                    callback: function(result) {
                        if (result === null) {
                            console.log('he left nothing');
                        } else {
                            // var item = $(event.target);
                            // var item2 = $(event.currentTarget);

                            // var username = template.data.username;

                            // // console.log(template.find('.member-name').innerHTML);
                            // // console.log(template.data.username);

                            // if (item.hasClass( "text-success" ) ) {
                            //     item.removeClass('text-success');

                            //     Meteor.call('increaseUserThumbsUpCount', username, false); 
                            // } else {
                            //     item.addClass('text-success');

                            //     Meteor.call('increaseUserThumbsUpCount', username, true);
                            //     var siblingThumbsDown = $(event.target).next('i');
                            //     if (siblingThumbsDown.hasClass("text-danger") ) {
                            //         siblingThumbsDown.removeClass('text-danger');
                                    
                            //         Meteor.call('increaseUserThumbsDownCount', username, false);
                            //     }
                            // }

                            Meteor.call('insertPlayerReview', 
                                template.data.username, 
                                PLAYER_REVIEW_TYPE_UP, 
                                result);

                            item.addClass('text-success');
                            pr[template.data.playerSlot] = true;
                            Session.set('playerReviews', pr);
                        }
                    }
                });
            }
        }

        

        
    },
    'click #thumbsDown' : function(event, template) {
        event.preventDefault();

        if (checkIfReviewingYourself(template.data.username)) {
            console.log("You are reviewing urself!");
        } else {
            var pr = Session.get('playerReviews');

            if (!pr) {
                pr = new Array(10);
            }

            if (!pr[template.data.playerSlot]) {
                bootbox.prompt({
                    title: "disband plz " + this.username,
                    callback: function(result) {
                        if (result === null) {
                            console.log('he left nothing');
                        } else {
                            // var item = $(event.target);
                            // var username = template.data.username;

                            // if (item.hasClass( "text-danger" ) ) {
                            //     item.removeClass('text-danger');
                                
                            //     Meteor.call('increaseUserThumbsDownCount', username, false); //down--
                            // } else {
                            //     item.addClass('text-danger');
                            //     Meteor.call('increaseUserThumbsDownCount', username, true); //down++

                            //     var previousThumbsUp = $(event.target).prev('i');
                            //     if (previousThumbsUp.hasClass("text-success") ) {
                            //         previousThumbsUp.removeClass('text-success');

                            //         Meteor.call('increaseUserThumbsUpCount', username, false); //up--
                            //     }
                            // }

                            Meteor.call('insertPlayerReview', 
                                template.data.username, 
                                PLAYER_REVIEW_TYPE_DOWN, 
                                result);

                            item.addClass('text-danger');
                            pr[template.data.playerSlot] = true;
                            Session.set('playerReviews', pr);
                        }
                    }
                });
            }
        }
    }
});