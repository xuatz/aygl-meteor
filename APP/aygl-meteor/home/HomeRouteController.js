HomeController = RouteController.extend({
    layoutTemplate: 'homeLayout'
});

Router.route('/home', function() {
    /*
        Main Content Block Rendering Logic
    */

    this.subscribe('displayCurrentMatches').wait();

    if (Meteor.user().profile.state === 'hosting' ||
        Meteor.user().profile.state === 'drafting' ||
        Meteor.user().profile.state === 'in-match' ||
        Meteor.user().profile.state === 'waiting' ||
        Meteor.user().profile.state === 'pending accept') {
        this.render('joinedmenu', {
            to: "toprightcorner"
        });
    } else {
        this.render('joinmenu', {
            to: "toprightcorner"
        });
    }

    if (Meteor.user().profile.state === 'hosting') {
        this.render('homecaptainslobby', {
            to: "maincontent"
        });
    } else if(Meteor.user().profile.state === 'pending accept'){
        //TODO RENDER PENDING ACCEPT HERE
    } else {
        this.render('homemaincontent', {
            to: "maincontent"
        });
    }

    this.render('homeprofile', {
        to: "profile"
    });
    this.render('homesidecontent', {
        to: "notification"
    });
    this.render('hometop10', {
        to: "top10"
    });
    this.render('homextra', {
        to: "xtra"
    });
    this.next()
}, {
    name: 'home',
    controller: 'HomeController'
});
