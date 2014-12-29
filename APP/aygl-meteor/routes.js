Router.onBeforeAction(function() {
    this.render('loading');
    if (Meteor.loggingIn()) {

    } else if (!Meteor.user()) {
        Router.go('/');
    } else {
        this.next();
    }
}, {
    except: ['root', 'verifiedsignup', 'signin']
});

Router.route('/', function() {
    this.layout('main');
    if (!Meteor.loggingIn()) {
        if (Meteor.user()) {
            this.render('mainloggedin');
            this.render('mainlogoutbutton', {
                to: "register"
            });
        } else {
            this.render('mainloggedout');
            this.render('mainregister', {
                to: "register"
            });
        }
    } else {
        this.render('mainloggingin');
    }
}, {
    name: "root"
});

Router.route('/verifiedsignup/', function() {
    var sig = encodeURI(this.params.query['s']) + '=';
    var routerObj = this;
    routerObj.render('loading');
    Meteor.call('checkValidSignup', sig, function(err, res) {
        if (!res) {
            //NOPES. Please Try again
            console.log(res);
            //TODO render NOPE PAGE!!!
        } else {
            //RENDER REGISTRATION PAGE
            registeringNow = Meteor.subscribe('registeringPlayers', sig);
            routerObj.layout('verifiedsignup', {
                data: function() {
                    var returnme = {
                        identity: res,
                        sig: sig
                    };
                    return returnme;
                }
            });
            routerObj.render('verifiedsignupinfo', {
                to: 'info'
            });
            routerObj.render('verifiedsignupform', {
                to: 'form'
            });
        }
    });
}, {
    name: "verifiedsignup"
});

Router.route('/signin', function() {
    var newparams = this.params.query;
    var newurl = 'https://steamcommunity.com/openid/login';
    var rinstance = this;
    var newlink = newurl + this.originalUrl;
    newlink = newlink.replace('id_res', 'check_authentication');
    HTTP.call('POST', newlink, function(err, res) {
        if (res.content.search('is_valid:true') !== -1) {
            //IS VALID
            VerifyTab.insert({
                steamID: newparams['openid.claimed_id'].substring(36, newparams['openid.claimed_id'].length),
                sig: encodeURI(newparams['openid.sig'])
            });
            rinstance.response.writeHead(301, {
                'Location': '/verifiedsignup/?s=' + newparams['openid.sig']
            });
            rinstance.response.end();
        } else {
            //IS INVALID. display evil messages for the bad boys.
            rinstance.response.end('bad boys is bad. die bad boys!');
        }
    });
}, {
    where: 'server',
    name: 'signin'
});
