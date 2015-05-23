

Template.draftinglayout.helpers({
	selectedGame: function() {
        return getUserRoomObject();
    }
});



























var draftTimeLeft = DRAFT_PICK_PLAYER_DURATION + BONUS_PREP_TIME;

//timer ticks every 1s
var timer = new Chronos.Timer(1000); //in ms, divide by 1000 to get time in seconds

var resetDraftingTime = function() {
    timer.stop();
    draftTimeLeft = DRAFT_PICK_PLAYER_DURATION + BONUS_PREP_TIME;
    timer.start();
}

Meteor.methods({
    draft_updateGameForNextDraft: function(gameId) {
        resetDraftingTime();
    }
});

Template.timer.onCreated(function() {
    console.log('hi im being created!');
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