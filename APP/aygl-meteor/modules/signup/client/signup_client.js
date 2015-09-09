/*  
======================================================================================================
    Template Helpers
    All Template helpers affecting the templates defined within signup.html will be placed here.
======================================================================================================
*/

//VERIFIED SIGNUP FORM

Template.verifiedsignupform.helpers({
    validUserState: function() {
        var result;
        if (Session.get('usernameValid') === true) {
            result = {
                form: "has-success has-feedback",
                logo: "glyphicon-ok"
            };
            return result;
        } else if (Session.get('usernameValid') === false) {
            result = {
                form: "has-error has-feedback",
                logo: "glyphicon-remove"
            };
            return result;
        } else {
            result = {
                form: " ",
                logo: " "
            };
            return result;
        }
    },
    validPassState: function() {
        var result;
        if (Session.get('passwordValid') || Session.get('passwordValid') === undefined) {
            result = {
                form: " ",
                logo: " "
            };
            $(function() {
                $("#password1").popover('hide');
            });
            return result;
        } else {
            result = {
                form: "has-warning has-feedback",
                logo: "glyphicon-warning-sign"
            };
            $(function() {
                $("#password1").popover('show');
            });
            return result;
        }
    },
    usernameCharLeft: function() {
        return Session.get('usernameCharLeft');
    },
    allowSubmit: function() {
        var result;
        if (Session.get('usernameValid') && Session.get('passwordValid')) {
            $(function() {
                $('#submit').prop('disabled', false);
            });
            result = {
                btn: "Submit",
                state: "btn-primary"
            };
            return result;

        } else {
            $(function() {
                $('#submit').prop('disabled', true);
            });
            result = {
                btn: "Submit",
                state: "btn-warning"
            };
            return result;
        }
    }
});




//VERIFIED SIGNUP INFO

Template.verifiedsignupinfo.helpers({
    idty: function() {
        return VerifyTab.findOne();
    }
});




/*
======================================================================================================
Template Event Handlers
All Template handlers for templates defined within signup.html will be placed here
======================================================================================================
*/

//VERIFIED SIGNUP FORM

Template.verifiedsignupform.events({
    'keyup #username, blur #username': function() {
        //CHECK USERNAME INPUT
        var regexPattern = /^[a-z0-9_-]+$/i;
        var name = Template.instance().find('#username').value;
        var result = regexPattern.test(name);
        Session.set('usernameValid', result);

        //CHECK USERNAME COUNT
        var usernameCharLimit = 25;
        if (name.length > usernameCharLimit) {
            Template.instance().find('#username').value = name.substr(0, usernameCharLimit);
        }
        Session.set('usernameCharLeft', usernameCharLimit - Template.instance().find('#username').value.length);
    },
    'keyup #password1, blur #password1, keyup #password, blur #password': function() {
        //CHECK PASSWORD WITH PASSWORD1 FIELD
        var pass1 = Template.instance().find('#password1').value;
        var pass = Template.instance().find('#password').value;

        if (pass === "" || pass1 === "") {
            Session.set('passwordValid', undefined);
        } else if (pass1 !== pass) {
            Session.set('passwordValid', false);
        } else {
            Session.set('passwordValid', true);
        }
    },
    'click #submit': function(evt) {
        evt.preventDefault();
        var username = Template.instance().find('#username').value;
        var password = Template.instance().find('#password').value;
        var email = Template.instance().find('#email').value;

        var steamIdentity = VerifyTab.findOne();

        Accounts.createUser({
            username: username,
            password: password,
            email: email,
            profile: {
                steamID: steamIdentity.steamID,
                personaname: steamIdentity.personaname,
                avatar: steamIdentity.avatar,
                hash: steamIdentity.sig,
                matchmaking: {
                    preferred_role: {
                        role1: null,
                        role2: null,
                        role3: null
                    },
                    preferred_hero: {
                        hero1: null,
                        hero2: null,
                        hero3: null
                    }
                },
                ranking: {
                    rank: 'TBD',
                    percentile: 40 //default value
                    //calibration: 5 //xz: not used
                },
                privateData: {
                    playerStats: {
                        minScore: '1000', //default value
                        maxScore: '3000', //default value
                        score: '2000' //default value
                    }
                },
                thumbsUpCount: 0,
                thumbsDownCount: 0,
                updated: steamIdentity.updated,
                state: 'idle',
                room: null
            }
        }, function(err) {
            if (err !== undefined) {
                alert(err);
                if (err.error === "Signup_Err_005" || err.error === "Signup_Err_004") {
                    Router.go('/');
                }
            } else {
                registeringNow.stop();
                Meteor.call('registrationComplete', steamIdentity.sig, username);
                Meteor.logoutOtherClients();
                Router.go('/play');
            }
        });
    }
});

/*
======================================================================================================
Template Rendered Handlers
All Template.rendered handlers for templates defined in signup.html will be placed here
======================================================================================================
*/

Template.verifiedsignupform.rendered = function() {
    $(function() {
        $("#username,#email").popover({
            placement: 'right',
            trigger: 'focus',
            container: 'body'
        });
    });
    $(function() {
        $("#password1").popover({
            placement: 'right',
            trigger: 'manual',
            container: 'body'
        });
    });
    Session.set('usernameCharLeft', 25);
};
