VerifyTab = new Mongo.Collection('vtab');

Router.route('/', function() {
    this.render('main');
});
Router.route('/verifiedsignup/:sig', function() {
    var sig = encodeURI(this.params.sig);
    var routerObj = this;
    routerObj.render('loading');
    Meteor.call('checkValidSignup',sig, function(err, res) {
        if(!res) {
          //NOPES. Please Try again
        } else{
          //RENDER REGISTRATION PAGE
          routerObj.render('loading');
        }
    });

});

Router.route('/signin', function() {
    var newparams = this.params.query;
    VerifyTab.insert({
        steamID: newparams['openid.claimed_id'].substring(36, newparams['openid.claimed_id'].length),
        sig: encodeURI(newparams['openid.sig'])
    });
    var newurl = 'https://steamcommunity.com/openid/login';
    var rinstance = this;
    var newlink = newurl + this.originalUrl;
    newlink = newlink.replace('id_res', 'check_authentication');
    HTTP.call('POST', newlink, function(err, res) {
        if (res.content.search('is_valid:true') !== -1) {
            //IS VALID
            rinstance.response.writeHead(301, {
                'Location': '/verifiedsignup/' + newparams['openid.sig']
            });
            rinstance.response.end();
        } else {
            //IS INVALID. display evil messages for the bad boys.
            rinstance.response.end('bad boys is bad. die bad boys!');
        }
    });
}, {
    where: 'server'
});



if (Meteor.isClient) {
    Meteor.subscribe('lol');
    Template.main.helpers({
        steamloginlink: function() {
            var url = 'https://steamcommunity.com/openid/login?openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select&openid.identity=http://specs.openid.net/auth/2.0/identifier_select&openid.mode=checkid_setup&openid.ns=http://specs.openid.net/auth/2.0&openid.realm=http://localhost:3000/&openid.return_to=http://localhost:3000/signin/';

            return url;

        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function() {
        // code to run on server at startup
        Meteor.publish('lol', function() {
            return VerifyTab.find();
        });
    });

    Meteor.methods({
        checkValidSignup: function(siggy) {
            if (VerifyTab.findOne({
                    sig: siggy
                }) === undefined) {
                return false;
            } else {
                return VerifyTab.findOne({
                    sig: siggy
                })['steamID'];
            }
        }
    });
}
