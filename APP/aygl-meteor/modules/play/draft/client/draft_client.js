Template.draftinglayout.helpers({
    selectedGame: function() {
        return getUserRoomObject();
    },
    drafter: function() {
        var game = getUserRoomObject();
        var drafter = _.find(game.captains, function(player) {
            return (player.team === game.draftingSide)
        });
        var result = drafter.name;
        return result;
    },
    teams: function() {
        var result = {
            R: [],
            D: []
        };
        var game = getUserRoomObject();
        //Get the Captains
        var RCaptain = _.find(game.captains, function(cpt) {
            if (cpt.team === "R") {
                return true;
            }
        });
        result.R.push(RCaptain);
        var DCaptain = _.find(game.captains, function(cpt) {
            if (cpt.team === "D") {
                return true;
            }
        });
        result.D.push(DCaptain);
        //Get the Players
        var RTeammates = _.where(game.draft, {
            team: "R"
        });
        result.R = _.union(result.R, RTeammates);
        var DTeammates = _.where(game.draft, {
            team: "D"
        });
        result.D = _.union(result.D, DTeammates);

        // logger.info('result');
        // logger.info(result);

        return result;
    },
    myDemo: function(side) {
        if (side === 'R') {
            return "radiant";
        } else {
            return "dire";
        }
    },
});

Template.draftingpool.helpers({
    eligiblePlayers: function() {
        var result;
        result = Meteor.users.find({
            "username": {
                $ne: Meteor.user().username
            }
        }, {
            sort: {
                "profile.ranking.percentile": -1
            }
        }).map(function(player, index) {
            player.arrayPos = index + 1;
            return player;
        });

        logger.info('draftingpool.eligiblePlayers[0]');
        logger.info(draftingpool.eligiblePlayers[0]);

        return result;
    }
});


























Template.timer.helpers({
    time: function() {
        //get the timer ticking
        console.log('tick tock');
        var game = Games.findOne({
            _id: Meteor.user().profile.room
        });

        if (game.draft.length >= 8) {
            return 0;
        }
        var endTime = moment(game.updatedDttm).add(DRAFT_PICK_PLAYER_DURATION + BONUS_PREP_TIME, 'seconds');
        var now = moment(TimeSync.serverTime());
        var duration = moment.duration(endTime - now);
        if (duration.asSeconds() > 30) {
            return 30;
        } else if (duration.asSeconds() < 0) {
            return 0;
        } else {
            return Math.floor(duration.asSeconds());
        }
    }
});
