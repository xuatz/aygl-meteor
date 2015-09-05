
isUserDraftingTurn = function() {
    // logger.debug('isUserDraftingTurn()');
    var game = getUserRoomObject();

    if (!game) {
        logger.error('game is not found');
    } else {

        var cpt = getCptByNameFromGame(game, Meteor.user().username);

        if (cpt) {
            // logger.debug('cpt.team');
            // logger.debug(cpt.team);
            // logger.debug('game.draftingSide');
            // logger.debug(game.draftingSide);

            if (cpt.team === game.draftingSide) {
                // logger.debug('isUserDraftingTurn(): yes it is their turn to draft');
                return true;
            }
        }
    }

    logger.info('isUserDraftingTurn(): no it is not their turn to draft');

    return false;
}

getCptByNameFromGame = function(game, username) {
    if (game) {
        if (username) {
            var res = _.find(game.captains, function(cpt) {
                // logger.info('cpt.name');
                // logger.info(cpt.name);
                return cpt.name == username;
            });

            if (!res) {
                logger.error('cpt not found');
                return null;
            } else {
                // logger.info('cpt is found');
                return res;
            }
        } else {
            logger.error('username is empty or null')
        }
    }
}

getCptBySideFromGame = function(game, side) {
    if (game) {
        if (side) {
            return _.find(game.captains, function(cpt) {
                // logger.info('cpt.team');
                // logger.info(cpt.team);
                return cpt.team == side;
            });
        } else {
            logger.error('side is empty or null');
        }
    } else {
        logger.error('game is empty or null');
    }
}

getPlayerSlotOfUserFromMatchDetails = function(matchDetails, username) {
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

getUserRoomObject = function() {
    var state = Meteor.user().profile.state;
    logger.debug('Player state: ' + state);

    if (!state) {
        // there is something wrong
        logger.error('there is something wrong, there is no state');
    } else {
        logger.debug('Meteor.user().profile.room');
        logger.debug(Meteor.user().profile.room);

        logger.debug('Meteor.user()');
        logger.debug(Meteor.user());

        switch(state) {
            case PLAYER_STATE_DRAFTING:
                logger.debug('drafting case');
                return getSelectedGame(Meteor.user().profile.room);
            case PLAYER_STATE_IN_MATCH:
                logger.debug('case in-match');
                return getSelectedMatch(Meteor.user().profile.room);
        }    
    }
}

getSelectedMatch = function(roomId) {
    logger.debug('getSelectedMatch(): matchId: ' + roomId);

    var res = MatchesCollection.findOne({
        _id : roomId
    });

    if (res) {
        logger.debug(res);
    }

    return res;
}

getSelectedGame = function(roomId) {
    return Games.findOne({
        _id : roomId
    });
}