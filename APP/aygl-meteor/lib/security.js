if (Meteor.isServer) {
  var crypto = Npm.require('crypto');
  //TODO and make sure we have salt from a common place
  //TODO might need lodash if some of the methods underscore dun provide

  var genAuthorization = function (data, hmac, callback) {
    var gen = true;

    if (_.isUndefined(callback)) {
      gen = false
      callback = hmac;
    }

    logger.debug('data: ');
    logger.debug(data);
    logger.debug('hmac: ' + hmac);

    crypto.pbkdf2(data, salt, 2, 128, function (err, hash) {
      if (err) {
        callback(err, null);
      } else {
        if (!gen) {
          callback(err, hash.toString('base64'));
        } else {
          callback(err, (hash.toString('base64') === hmac));
        }
      }
    });
  };

  var concatRequest = function (path, params) {
    var sum = path + _.reduce(params, function (sum, next) {
      if (_.isObject(next)) {
        next = JSON.stringify(next);
      }
      return sum + next;
    });

    return sum;
  };

  var authorizationMidd = function (req, res, next) {
    var hmac
      , params
      , sum;

    switch(req.method) {
      case 'POST':
        params = req.body;
      break;
      default:
      case 'GET':
        params = req.query;
    }

    if (!_.isEmpty(params)) {
      logger.debug('not empty!');
      sum = concatRequest(req.path, params);
    } else {
      logger.debug('its empty =(, so he taking the req.path');
      sum = req.path;
    }

    logger.debug('sum: ' + sum);

    if (req.headers.authorization) {
      var authorizationCode = req.headers.authorization.split(' ')[1];

      genAuthorization(sum, function (err, hash) {
        if (hash !== authorizationCode) {
          logger.debug('hash: ' + hash);
          logger.debug('authorizationCode: ' + authorizationCode);

          res.status(401).send('Unauthorized.');
        } else {
          next();
        }
      });
    } else {
      res.status(400).send('Missing authorization code.');
    }
  };

  var corsMidd = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  };
}
