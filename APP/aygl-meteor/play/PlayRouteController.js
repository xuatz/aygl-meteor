PlayController = RouteController.extend({
    layoutTemplate: 'playLayout'
});

Router.route('/play', function() {
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

    //Check which page to render
    if (Meteor.user().profile.state === "drafting") {
        //RENDER DRAFTING PAGE
        this.render('draftinglayout', {
            to: "playmaincontent"
        });
    } else if (Meteor.user().profile.state === "in-match") {
        //RENDER MATCH PAGE
        this.render('matchlayout', {
            to: "playmaincontent"
        });

    } else {
        //IDLE, READY, RESERVED, PENDING ACCEPT, HOSTING, WAITING
        this.render('homelayout', {
            to: "playmaincontent"
        });
    }

    this.next()
}, {
    name: 'home',
    controller: 'PlayController'
});
