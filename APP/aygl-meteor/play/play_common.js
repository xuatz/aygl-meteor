

getPlayerSlotOfUserFromMatchDetails = function(matchDetails, username) {
    console.log('start of getPlayerSlotOfUser()');

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
    console.log('Player state: ' + state);

    if (!state) {
        // there is something wrong
        console.log('there is something wrong, there is no state');
    } else {
        switch(state) {
            case PLAYER_STATE_DRAFTING:
                return getSelectedGame(Meteor.user().profile.room);
            case PLAYER_STATE_MATCH:
                return getSelectedMatch(Meteor.user().profile.room);
        }    
    }
}

getSelectedMatch = function(roomId) {
    return MatchesCollection.findOne({
        _id : roomId
    }) || MatchesCollection.findOne(); //hardcoded for dev purposes
}

getSelectedGame = function(roomId) {
    return Games.findOne({
        _id : roomId
    }) || Games.findOne(); //hardcoded for dev purposes
}