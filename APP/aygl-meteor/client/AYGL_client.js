/*
======================================================================================================
Client Side Common Strings
======================================================================================================
*/

DOTA_MATCH_ID_COLON = "Dota Match ID:"

/*
======================================================================================================
Main Client Side Template Helpers
======================================================================================================
*/

Template.mainregister.helpers({
    steamloginlink: function() {
        var url = 'https://steamcommunity.com/openid/login?openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select&openid.identity=http://specs.openid.net/auth/2.0/identifier_select&openid.mode=checkid_setup&openid.ns=http://specs.openid.net/auth/2.0&openid.realm=http://' + le_web_address + '/&openid.return_to=http://' + le_web_address + '/signin/';
        return url;
    }
});

Template.mainloggedin.helpers({
    username: function() {
        if (Meteor.user()) {
            return Meteor.user().username;
        }
    }
});

Template.registerHelper('skillbracket', function(percentile) {
    var result = "Unclassified";

    //Categorisation by elimination
    if (percentile < 11) {
        result = "Scum";
    } else if (percentile < 21) {
        result = "Novice";
    } else if (percentile < 41) {
        result = "Intermediate";
    } else if (percentile < 61) {
        result = "Skilled";
    } else if (percentile < 81) {
        result = "Expert";
    } else if (percentile < 96) {
        result = "Veteran";
    } else {
        result = "Legend";
    }

    return result;
});

/*
======================================================================================================
Main Client Side Template Event Listeners
======================================================================================================
*/

Template.mainlogoutbutton.events({
    'click #logoutbtn': function(evt) {
        evt.preventDefault();
        Meteor.logout();
    }
});

Template.main.events({
    'click #loginsubmit, submit': function(evt) {
        evt.preventDefault();
        var username = Template.instance().find('#loginuser').value;
        var password = Template.instance().find('#loginpass').value;
        Meteor.loginWithPassword(username, password, function(error) {
            if (error) {
                alert(error);
            } else {
                Router.go('/home');
            }
        });
    }
});

/*
======================================================================================================
Main Client Side Collection Subscriptions
======================================================================================================
*/

if (!Meteor.loggingIn() && Meteor.user()) {
    Meteor.subscribe('myalerts');
}
