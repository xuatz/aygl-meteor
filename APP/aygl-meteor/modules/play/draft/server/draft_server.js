/*
======================================================================================================
Error Definitions for Home Page
Any Errors which will be thrown will be defined in this section
======================================================================================================
*/

draft_error_001_ACTION_NOT_ALLOWED = new Meteor.Error('Draft_Err_001', 'This action is not allowed!');

//======================================================================================================
serverDraftDurationInMs = (DRAFT_PICK_PLAYER_DURATION + BONUS_PREP_TIME) * 1000;

draft_getGameHostSide = function(game) {
    //Random logic to determine which side the host is on
    return game.captains[0].team;
}

draft_isDraftingComplete = function(game) {
    logger.debug("isDraftingComplete?");

    logger.debug("draft count: " + game.draftCount);

    if (game.draftCount === 8) {
        logger.debug("isDraftingComplete: yes");
        return true;
    } else {
        logger.debug("isDraftingComplete: no");
        return false
    }
}

function draft_checkIfCptDraftedPlayer(gameId, draftCount) {
    logger.debug('start of checkIfCptDraftedPlayer');
    var g = Games.findOne({
        _id: gameId
    });

    if (!g) {
        logger.error('Game cannot be found!');
    } else {
        logger.debug('g.draftCount: ' + g.draftCount);
        logger.debug('draftCount: ' + draftCount);

        if (g.draftCount > draftCount) {
            logger.debug("Cpt drafted before timer is up, hence do nothing.");
            //means the cpt drafted a player before timer is up
            //hence do nothing
        } else {
            //cpt didn pick a player within timer duration
            
            logger.debug('g.draft.length: ' + g.draft.length);
            logger.debug('g.draft: ');
            logger.debug(g.draft);

            if (g.draft.length) {
                if (g.draft.length < 8) {
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

                    if (!player) {
                        logger.error('hmm something is wrong, player is null? maybe all players drafted liao');
                    } else {
                        draft_draftPlayer(gameId, g.draftingSide, player._id);    
                    }    
                }
            }
        }
    }

    logger.debug('end of checkIfCptDraftedPlayer');
}

draft_newDraftingTurn = function(gameId) {
    logger.debug('start of newDraftingTurn');
    logger.debug(gameId);

    var g = Games.findOne({
        _id: gameId
    });

    if (!g) {
        logger.debug("Game not found!");
    } else {
        logger.debug('g.draft.length: ' + g.draft.length);
        
        if (draft_isDraftingComplete(g)) {
            logger.info('End of drafting, going to match lobby');
            draft_goToMatchLobby(g);
        } else {
            var draftCount = Meteor.call("draft_updateGameForNextDraft", gameId);

            Meteor.setTimeout(
                function() {
                    draft_checkIfCptDraftedPlayer(gameId, draftCount);
                }, 
                serverDraftDurationInMs
            );
        }
    }

    logger.debug('end of newDraftingTurn');
}

draft_goToMatchLobby = function(game) {
    logger.debug('start of draft_goToMatchLobby()');
    logger.debug('game._id: ' + game._id);

    var matchPlayerResults = [];
    var usernames = [];

    if (!game.draft) {
        logger.error('game.draft is empty!');
    } else {
        if (!game.captains) {

        } else {
            var cptRad;
            var cptDire;

            if (game.captains[0] === 'R') {
                cptRad = game.captains[0];
                cptDire = game.captains[1];
            } else {
                cptDire = game.captains[0];
                cptRad = game.captains[1];
            }

            var user = Meteor.users.findOne({ username: cptRad.name });

            var mpr = {
                'username': cptRad.name,
                'playerSlot': 0,
                'minScore': user.profile.privateData.playerStats.minScore,
                'maxScore': user.profile.privateData.playerStats.maxScore,
                'score': user.profile.privateData.playerStats.score
            };

            matchPlayerResults.push(mpr);
            usernames.push(mpr.username);

            user = Meteor.users.findOne({ username: cptDire.name });

            mpr = {
                'username': cptDire.name,
                'playerSlot': 5,
                'minScore': user.profile.privateData.playerStats.minScore,
                'maxScore': user.profile.privateData.playerStats.maxScore,
                'score': user.profile.privateData.playerStats.score
            };

            matchPlayerResults.push(mpr);
            usernames.push(mpr.username);
        }

        logger.debug('game');
        logger.debug(game);

        var radCount = 1;
        var direCount = 1;

        _.each(game.draft, function(player, index) {
            // logger.debug('index: ' + index);
            // logger.debug('player');
            // logger.debug(player);
            
            if (!player.team) {

            } else {
                var playerSlot = 0;

                logger.debug(player);
                logger.debug('player');

                switch(player.team) {
                    case 'R':
                        playerSlot = radCount;
                        radCount++;
                        break;
                    case 'D':
                        playerSlot = direCount + 5;
                        direCount++;
                        break;
                }

                logger.debug('playerSlot:after: ' + playerSlot);

                var user = Meteor.users.findOne({ username: player.name });

                //TODO pending playerSlot information, either 0-9 or rad/dire 0-4
                var mpr = {
                    'username': player.name,
                    'playerSlot': playerSlot,
                    'minScore': user.profile.privateData.playerStats.minScore,
                    'maxScore': user.profile.privateData.playerStats.maxScore,
                    'score': user.profile.privateData.playerStats.score
                };

                matchPlayerResults.push(mpr);
                usernames.push(mpr.username);
            }
        });

        //==============

        // var crypto = Npm.require('crypto');

        // generateMatchPassword = function() {
        //     var now = new Date();
        //     var hash = crypto.createHash('md5')
        //                 .update(now.toString())
        //                 .digest("hex");

        //     return hash.substring(0,8)
        // }

        var password = CryptoJS.MD5(game._id).toString().substring(0, 8);

        Games.update(
            {_id: game._id},
            {
                $set: {
                    password: password
                }
            }
        );

        //==============

        logger.debug('matchPlayerResults');
        logger.debug(matchPlayerResults);

        logger.debug('MATCH_STATUS_IN_PROGRESS: ' + MATCH_STATUS_IN_PROGRESS);

        var matchId = MatchesCollection.insert({
            gameId: game._id,
            status: MATCH_STATUS_IN_PROGRESS,
            matchPlayerResults : matchPlayerResults
        });

        logger.info('XZ:5/9/15: matchId: ' + matchId);

        var randomM = MatchesCollection.findOne(matchId);

        logger.debug('match obj');
        logger.debug(randomM);

        //==============

        Meteor.users.update({
            'username': {
                $in: usernames
            }
        }, {
            $set: {
                "profile.state": PLAYER_STATE_IN_MATCH,
                "profile.room": matchId
            }
        }, {
            multi: true
        });
    }
}

draft_startDrafting = function(gameId) {
    logger.debug('start of startDrafting');
    var g = Games.findOne({
        _id: gameId
    }) || Games.findOne();

    if (!g) {
        logger.debug("Game not found");
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
    logger.debug('end of startDrafting');
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
        var g = Games.findOne({
            _id: gameId
        });

        var hostSide = draft_getGameHostSide(g);
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
    draftPlayer: function(playerId) {
        logger.debug('MeteorMethod:draftPlayer:triggered');

        var game = getUserRoomObject();

        var team = _.find(game.captains, function(item) {
            return item.name == Meteor.user().username;
        }).team;

        // logger.debug(team);

        // logger.info('game.captains');
        // logger.info(game.captains);

        // logger.info('game.draftingSide');
        // logger.info(game.draftingSide);

        // logger.info('Meteor.user()');
        // logger.info(Meteor.user());

        //Check that captain is real
        if (Meteor.user().profile.state != PLAYER_STATE_DRAFTING) {
            throw draft_error_001_ACTION_NOT_ALLOWED;
        } else {
            //Draft the player in if check is successful
            draft_draftPlayer(game._id, team, playerId);
        }

    }
});
