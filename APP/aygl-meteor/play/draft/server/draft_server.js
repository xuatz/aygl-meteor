/*
======================================================================================================
Error Definitions for Home Page
Any Errors which will be thrown will be defined in this section
======================================================================================================
*/

draft_error_001_ACTION_NOT_ALLOWED = new Meteor.Error('Draft_Err_001', 'This action is not allowed!');

//======================================================================================================
serverDraftDurationInMs = (DRAFT_PICK_PLAYER_DURATION + BONUS_PREP_TIME) * 1000;

draft_getGameHostSide = function() {
    //Random logic to determine which side the host is on

    // if (Math.random() > 0.5) {
    //     return "D";
    // } else {
    //     return "R";
    // }
    return "D";
}

draft_isDraftingComplete = function(game) {
    console.log("isDraftingComplete?");

    console.log("draft count: " + game.draftCount);

    if (game.draftCount === 8) {
        console.log("isDraftingComplete: yes");
        return true;
    } else {
        console.log("isDraftingComplete: no");
        return false
    }
}

function draft_checkIfCptDraftedPlayer(gameId, draftCount) {
    console.log('start of checkIfCptDraftedPlayer');
    var g = Games.findOne({
        _id: gameId
    });

    console.log('g.draftCount: ' + g.draftCount);
    console.log('draftCount: ' + draftCount);

    if (g.draftCount > draftCount) {
        console.log("Cpt drafted before timer is up, hence do nothing.");
        //means the cpt drafted a player before timer is up
        //hence do nothing
    } else {
        //cpt didn pick a player within timer duration

        //randomly pick 1 from top 40% of eligible player pool for the current drafting side
        var eligiblePlayers = home_eligiblePlayers(g.lobbyPercentile).fetch();
        var actualEligibleList = _.filter(eligiblePlayers, function(player) {
            var result = false;
            if (player.profile.state === 'reserved' || player.profile.state === 'ready') {
                result = true;
            }
            return result;
        });
        var sortedEligibleList = _.sortBy(actualEligibleList, function(x){return -(x.profile.ranking.percentile)})
        var index = Math.floor((Math.random() * sortedEligibleList.length * 0.4));
        var player = sortedEligibleList[index];

        draft_draftPlayer(gameId, g.draftingSide, player._id);
    }

    console.log('end of checkIfCptDraftedPlayer');
}

draft_newDraftingTurn = function(gameId) {
    console.log('start of newDraftingTurn');
    console.log(gameId);

    var g = Games.findOne({
        _id: gameId
    });

    if (!g) {
        console.log("Game not found!");
    } else {
        if (draft_isDraftingComplete(g)) {
            //goToMatchLobby();

            //END POINT OF DRAFTING


        } else {
            var draftCount = Meteor.call("draft_updateGameForNextDraft", gameId);

            Meteor.setTimeout(
                function() {
                    console.log('huat ah');
                    draft_checkIfCptDraftedPlayer(gameId, draftCount);
                }, serverDraftDurationInMs);
        }
    }

    console.log('end of newDraftingTurn');
}

draft_startDrafting = function(gameId) {
    console.log('start of startDrafting');
    var g = Games.findOne({
        _id: gameId
    }) || Games.findOne();

    if (!g) {
        console.log("Game not found");
    } else {
        // wait for 5s
        Meteor.setTimeout(function() {
            Games.update({
                _id: gameId
            }, {
                $set: {
                    draftCount: 0
                }
            });

            draft_newDraftingTurn(gameId); //this method will update the draftingSide

            //clients will listen on the reactive value of "Game.draftingSide"
            //if draftingSide != null, will start the timer
            //if cptSide = draftingSide, panel is enabled, else disabled

        }, 1000); //use 5000 in production
    }
    console.log('end of startDrafting');
}

draft_draftPlayer = function(gameId, team, playerId) {
    //Server side trusted method
    var selectedPlayer = Meteor.users.findOne({
        _id: playerId
    });

    //1. Edit Player Object information
    Meteor.users.update({
        _id: playerId
    }, {
        $set: {
            "profile.state": PLAYER_STATE_SELECTED,
            "profile.room": gameId
        }
    });

    //2. Add player information into Games
    var resultingDraftPlayer = {
        name: selectedPlayer.username,
        team: team,
        personaname: selectedPlayer.profile.personaname,
        avatar: selectedPlayer.profile.avatar
    };

    Games.update({
        _id: gameId
    }, {
        $push: {
            draft: resultingDraftPlayer
        }
    });

    draft_newDraftingTurn(gameId);
}

//===============================================================

Meteor.methods({
    draft_updateGameForNextDraft: function(gameId) {
        // Games.update({
        //     _id: gameId
        // }, {
        //     $set: {
        //         draftingSide: null
        //     }
        // });

        var g = Games.findOne({
            _id: gameId
        });

        var hostSide = draft_getGameHostSide();
        var draftCount = g.draftCount;

        var draftingSide = DRAFTING_ORDER[draftCount];
        var newSide;
        switch (draftingSide) {
            case "H":
                newSide = hostSide;
                break;
            case "C":
                if (hostSide === "R") {
                    newSide = "D";
                } else {
                    newSide = "R";
                }
                break;
        }

        Games.update({
            _id: gameId
        }, {
            $set: {
                draftingSide: newSide
            },
            $inc: {
                draftCount: 1
            }
        });

        return draftCount + 1;
    },
    reset: function(gameId) {
        //THIS IS A DEBUGGING FUNCTION. REMOVE BEFORE PRODUCTION
        Games.update({
            _id: gameId
        }, {
            $set: {
                draftingSide: null
            }
        });
    },
    draftPlayer: function(playerId, team) {
        console.log('MeteorMethod:draftPlayer:triggered');
        //Check that captain is real
        if (Meteor.user().state !== PLAYER_STATE_DRAFTING) {
            throw draft_error_001_ACTION_NOT_ALLOWED;
        } else {
            //Draft the player in if check is successful
            draft_draftPlayer(Meteor.user().room, team, playerId);
        }

    }
});
