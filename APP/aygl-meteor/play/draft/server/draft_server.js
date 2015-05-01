var serverDraftDurationInMs = (DRAFT_PICK_PLAYER_DURATION + 5) * 1000;

var getGameHostSide = function(game) {
	//TODO logic to determine which side the host is on

	return "D"; //hardcoded for dev
}

var updateGameForNextDraft = function(gameId) {
	Games.update(
        { _id : gameId },
        {
            $set: {
            	draftingSide: null
            }
        }
    );

	var g = Games.findOne({_id : gameId});

	var hostSide = getGameHostSide(g);
    var draftCount = g.draftCount;

    var draftingSide = DRAFTING_ORDER[draftCount + 1];
    var newSide;
    switch(draftingSide) {
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

	Games.update(
        { _id : gameId },
        {
            $set: {
            	draftingSide: newSide
            },
            $inc: { 
            	draftCount: 1 
            }
        }
    );

    return draftCount + 1;
}

var isDraftingComplete = function(game) {
	console.log("isDraftingComplete?");
	//TODO pending implementation
	//if 8 players have been drafted

	console.log("draft count: " + game.draftCount);

	if (game.draftCount === 4) {
		console.log("isDraftingComplete: yes");
		return true;
	} else {
		console.log("isDraftingComplete: no");
		return false
	}
}

function checkIfCptDraftedPlayer(gameId, draftCount) {
	console.log('start of checkIfCptDraftedPlayer');
	var g = Games.findOne({_id : gameId});

	if (g.draftCount > draftCount) {
		console.log("Cpt drafted before timer is up, hence do nothing.");
		//means the cpt drafted a player before timer is up
		//hence do nothing
	} else {
		//cpt didn pick a player within timer duration

		//TODO randomly pick 1 from top 40% of eligible player pool for the current drafting side
        //     var eligiblePlayers = []; //TODO
        //     var index = Math.floor((Math.random() * eligiblePlayers.size() * 0.4));
        //     var player = eligiblePlayers.get(index);

        //     //TODO put the player somewhere

        newDraftingTurn(gameId);
	}

	console.log('end of checkIfCptDraftedPlayer');
}

var newDraftingTurn = function(gameId) {
	console.log('start of newDraftingTurn');

	console.log(gameId);

	var g = Games.findOne({_id : gameId});

	if (!g) {
		console.log("Game not found!");
	} else {
		if (isDraftingComplete(g)) { 
			//goToMatchLobby();
		} else {
			var draftCount = updateGameForNextDraft(gameId);

			Meteor.setTimeout(
				function() {
					console.log('huat ah');
					checkIfCptDraftedPlayer(gameId, draftCount);
				}
			, serverDraftDurationInMs);
		}
	}
	
	console.log('end of newDraftingTurn');
}

var startDrafting = function(gameId) {
	console.log('start of startDrafting');
	var g = Games.findOne({_id : gameId});

	if (!g) {
		console.log("Game not found");
	} else {
		// wait for 5s
		Meteor.setTimeout(function() {
			Games.update(
		        { _id : gameId },
		        {
		            $set: {
		            	draftCount: 0
		            }
		        }
		    );

			newDraftingTurn(gameId); //this method will update the draftingSide

			//clients will listen on the reactive value of "Game.draftingSide"
			//if draftingSide != null, will start the timer
			//if cptSide = draftingSide, panel is enabled, else disabled

		}, 1000); //use 5000 in production
	}
	console.log('end of startDrafting');
}

//===============================================================

Meteor.methods({
	demo: function(gameId) {
		startDrafting(gameId);
	},
	reset: function(gameId) {
		Games.update(
	        { _id : gameId },
	        {
	            $set: {
	            	draftingSide: null
	            }
	        }
	    );
	},
	playerDrafted: function(gameId, selectedUserId) {
		console.log(this.userId);
		Meteor.users.findOne({_id: this.userId})

		//insert dt logic to check if player selected is valid
		//update player and game draft pool accordingly

		newDraftingTurn(gameId);
	}
});