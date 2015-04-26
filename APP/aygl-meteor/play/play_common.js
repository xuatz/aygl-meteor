

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

