Router.configure({
    layoutTemplate: 'MainLayout'
});

Router.route('/', function() {
    this.render('main');
});

Router.route('/signin', function() {
    newlink = 'https://steamcommunity.com/openid/login';
    newlink = newlink + window.location.search;
    newlink = newlink.replace("id_res", "check_authentication");
    window.location.replace(newlink);
    this.render('main');
});

if (Meteor.isClient) {
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
    });
}
