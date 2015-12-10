/*
======================================================================================================
Error Definitions for Signup Page
Any Errors which will be thrown will be defined in this section
======================================================================================================
*/
signup_error_001_USERNAME_IN_USE = new Meteor.Error('Signup_Err_001', 'Username is already taken.');
signup_error_002_USERNAME_TOO_LONG = new Meteor.Error('Signup_Err_002', 'Username is too long.');
signup_error_003_USERNAME_IS_INVALID = new Meteor.Error('Signup_Err_003', 'Username has invalid characters.');
signup_error_004_INVALID_REGISTRATION = new Meteor.Error('Signup_Err_004', 'Invalid verification signature');
signup_error_005_DUPLICATE_STEAMUSER = new Meteor.Error('Signup_Err_005', 'The Steam account used has already been linked to an AYGL Account');

/*
======================================================================================================
Server Methods
Methods used by during the Signup process will be placed here
======================================================================================================
*/

//xz:18/05/2015: upon success, create a new user on MainDB
//and return the slightly more accurate initial playerStats

//in the case this doesnt get called/failed, it doesnt break shit.
//the user starting stats just wun be more 'accurate',
//but who is to say our theory is 'accurate' in the first place lol
var createNewUserOnMainDB = function(username) {
  logger.debug('start of createNewUserOnMainDB');
  logger.info('creating new user: ' + username);

  var header = '/playerstat';
  var payload = username;
  var hash = ayglHash(header, payload);

  var url = "http://" + process.env.MAIN_DB_URL + header;

  HTTP.call("POST", url, {
    headers: {
      authorization: "aygldb " + hash
    },
    params: {
      username: username
    }
  }, function(err, res) {
    if (err) {
      logger.error('==================');
      logger.error('there is an error');
      logger.error(err);
    }
    if (res) {
      logger.debug('==================');
      if (res.statusCode === 201) {
        Meteor.users.update({
          username: username
        }, {
          $set: {
            'profile.privateData.playerStats.minScore': res.data.minScore,
            'profile.privateData.playerStats.maxScore': res.data.maxScore,
            'profile.privateData.playerStats.score': res.data.score
          }
        });
      }
    }
  });
}

Meteor.methods({
    checkValidSignup: function(siggy) {
        if (VerifyTab.findOne({
                sig: siggy
            }) === undefined) {
            return false;
        } else {
            return VerifyTab.findOne({
                sig: siggy
            });
        }
    },
    registrationComplete: function(siggy, username) {
        createNewUserOnMainDB(username);

        VerifyTab.remove({
            sig: siggy
        });
    }
});

Accounts.validateNewUser(function(user) {
    //VERIFY USERNAME IS NOT REPEATED OR CASE-INSENSITIVE REPEATED (e.g. user/User/uSer/uSER/USER)
    var namelist = Meteor.users.find({}, {
        fields: {
            username: 1,
        }
    }).fetch();

    namelist.forEach(function(name) {
        if (user.username.toLowerCase() === name.username.toLowerCase()) {
            throw signup_error_001_USERNAME_IN_USE;
        }
    });

    //VERIFY USERNAME IS NOT TOO LONG
    var usernameCharLimit = 25;
    if (user.username.length > usernameCharLimit) {
        throw signup_error_002_USERNAME_TOO_LONG;
    }

    //VERIFY USERNAME CONFORMS TO REGEX
    var regexPattern = /^[a-z0-9_-]+$/i;
    if (!regexPattern.test(user.username)) {
        throw signup_error_003_USERNAME_IS_INVALID;
    }

    //VERIFY STEAMID HAS NOT BEEN USED BEFORE
    if (Meteor.users.find({
            "profile.steamID": user.profile.steamID
        }).count() > 0) {
        VerifyTab.remove({sig: user.profile.hash});
        throw signup_error_005_DUPLICATE_STEAMUSER;
    }

    //VERIFY USER DID NOT HIJACK Accounts.createUser()
    if (VerifyTab.find({
            sig: user.profile.hash
        }).count() === 0) {
        throw signup_error_004_INVALID_REGISTRATION;
    }
    return true;
});
