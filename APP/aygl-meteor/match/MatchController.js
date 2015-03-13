MatchController = RouteController.extend({
    layoutTemplate: 'matchLayout'
});

Router.route('/match', function() {
    this.render('matchradiant', {
        to: "radiant"
    });
    this.render('matchdire', {
        to: "dire"
    });


    this.next()
}, {
    name: 'match',
    controller: 'MatchController'
});
