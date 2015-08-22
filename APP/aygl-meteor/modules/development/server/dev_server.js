/*
	Debugging Methods and Tools

	Code that is placed here will not be utilised in Production. Remember to remove before deployment
*/

/*======================================================================================================
DUMMY USER SPAWNER/DESPAWNER
This function will generate any number of dummy users with fully populated and randomized dummy data
======================================================================================================*/
Meteor.methods({
    spawnDummies: function(dummyCount) {
        console.log('debug_spawnDummies: STARTED');
        var startingIndex = Meteor.users.find({
            username: /^DummyUser.*/
        }).count() + 1
        console.log('debug_spawnDummies: Found ' + (startingIndex - 1) + ' DummyUsers already present.');
        console.log('debug_spawnDummies: Creating DummyUsers ' + startingIndex + ' to ' + (startingIndex + dummyCount - 1) + ' now.');


        for (var i = startingIndex; i < (startingIndex + dummyCount); i++) {
            console.log('Creating Dummy: ' + i);
            //Initialise the dota2assets array and roleList array
            var d2a = _.toArray(dota2assets.heroes);

            var prefHeroes = _.map(dota2assets.heroes, function(hero, key) {
                return key;
            });

            var rL = _.toArray(roleList);
            //Populate VerifyTab with dummy sig
            VerifyTab.insert({
                sig: 'dummyhash',
                updated:true
            });
            //Generate values for fields
            var username = 'DummyUser' + i;
            var password = 'dummy';
            var email = 'dummy' + i + '@dummies.com';
            var steamID = 'dummysteamID' + i;
            var personaname = 'Dummy Steam Name ' + i;
            var avatar = d2a[Math.floor(Math.random() * d2a.length)].landscape_hover;
            var hash = 'dummyhash';
            var roles = [rL[Math.floor(Math.random() * rL.length)], rL[Math.floor(Math.random() * rL.length)], rL[Math.floor(Math.random() * rL.length)]];
            var heroes = [
                [prefHeroes[Math.floor(Math.random() * prefHeroes.length)]],
                [prefHeroes[Math.floor(Math.random() * prefHeroes.length)]],
                [prefHeroes[Math.floor(Math.random() * prefHeroes.length)]]
            ];
            var percentile = Math.floor(Math.random() * 100);
            var pLowerLimit = Math.round(percentile * 0.7);
            var pUpperLimit = Math.round(percentile * 1.1);
            if (pUpperLimit > 100) {
                pUpperLimit = 100;
            }

            logger.info('percentile: ' + percentile);
            logger.info('pLowerLimit: ' + pLowerLimit);
            logger.info('pUpperLimit: ' + pUpperLimit);

            var state = (i % 2 === 0) ? PLAYER_STATE_READY : PLAYER_STATE_IDLE;

            console.log('Fields initialized. Invoking createUser() for Dummy ' + i);
            //Invoke createUser()
            Accounts.createUser({
                username: username,
                password: password,
                email: email,
                profile: {
                    steamID: steamID,
                    personaname: personaname,
                    avatar: avatar,
                    hash: hash,
                    matchmaking: {
                        preferred_role: {
                            role1: roles[0],
                            role2: roles[1],
                            role3: roles[2]
                        },
                        preferred_hero: {
                            hero1: heroes[0],
                            hero2: heroes[1],
                            hero3: heroes[2]
                        }
                    },
                    ranking: {
                        rank: 'TBD',
                        percentile: percentile,
                        pLowerLimit: pLowerLimit,
                        pUpperLimit: pUpperLimit
                    },
                    privateData: {
                        playerStats: {
                            minScore: '2000', //default value
                            maxScore: '3000', //default value
                            score: '2500' //default value
                        }
                    },
                    updated: true,
                    state: state,
                    room: null
                }
            });
            console.log('createUser() end for Dummy ' + i);

        }
        //Clearing out VerifyTab
        VerifyTab.remove({
            sig: 'dummyhash'
        });
        console.log('debug_spawnDummies: ENDED');
    },
    despawnDummies: function() {
        var result = Meteor.users.remove({
            username: /^DummyUser.*/
        });
        console.log(result + ' DummyUsers were removed.');
    }
});
