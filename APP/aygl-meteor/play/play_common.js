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
    console.log('Player state: ' + Meteor.user().profile.state);
    var state = Meteor.user().profile.state;

    if (!state) {
        // there is something wrong
    } else {
        switch(state) {
            case PLAYER_STATE_DRAFTING:
                return getSelectedMatch(Meteor.user().profile.room);
            case PLAYER_STATE_MATCH:
                return getSelectedGame(Meteor.user().profile.room);
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