Template.joinedmenu.events({
    'click #leavegame': function() {
        Meteor.call('resetState');
    }
});

Template.playerRow.events({
    'click #playerRowElement' : function(evt) {
        if (isUserDraftingTurn()) {
            console.log('i clicked on a player!');

            $('tr.success').removeClass('success');
            $(event.target).closest('tr').addClass('success');
            
            Session.set('selectedDraftPlayerId', this._id);
            // console.log(this);
            // console.log(this.profile);
        } else {
            logger.info('it is not this cpt turn to pick, ignore their input');
        }
    }
});

Template.draftinglayout.events({
    'click #btnMine' : function(evt) {
        if (isUserDraftingTurn()) {
            console.log('i clicked btnMine');

            var selectedUserId = Session.get('selectedDraftPlayerId');

            if (selectedUserId) {
                logger.info(selectedUserId);
                Meteor.call('draftPlayer', selectedUserId);
                Session.set('selectedDraftPlayerId', null);
            }
        } else {
            logger.info('it is not this cpt turn to pick, ignore their input');
        }
    }
});

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

Template.draftingpool2.helpers({
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

        return result;
    }
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

        return result;
    }
});

Template.prefHeroIcon.helpers({
    getHeroMiniIcon: function(heroKey) {
        // logger.info('getHeroMiniIcon()');
        // logger.debug('heroKey: ' + heroKey);

        var hero = _.find(dota2assets.heroes, function(item, key) {
            // console.log('key: ' + key);
            // console.log('heroKey: ' + heroKey);

            return key == heroKey;
        });

        if (hero) {
            // logger.debug('hero is found!');
            // logger.debug(hero);
            return hero.mini_icon;
        } else {
            logger.error('hero cannot be found');
            return null;
        }
    },
    getHeroName: function(heroKey) {
        var hero = _.find(dota2assets.heroes, function(item, key) {
            return key == heroKey;
        });

        if (hero) {
            return hero.name;
        } else {
            return null;
        }
    }
});
























Template.timer.helpers({
    time: function() {
        //logger.debug('tick tock');
        var game = Games.findOne({
            _id: Meteor.user().profile.room
        });

        if (game) {
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
        } else {
            return 0;   
        }
    }
});


Template.prefHeroIcon.rendered = function() {
    //INITIALIZE POPOVERS
    $('[data-toggle="tooltip"]').tooltip();
};