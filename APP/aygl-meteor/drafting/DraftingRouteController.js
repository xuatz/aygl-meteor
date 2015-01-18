DraftingController = RouteController.extend({
    layoutTemplate: 'draftingLayout'
});

Router.route('/drafting', function() {
    this.render('draftingradiant', {
        to: "radiant"
    });
    this.render('draftingdire', {
        to: "dire"
    });

    this.render('draftingpool', {
        to: "pool"
    });

    this.next()
}, {
    name: 'drafting',
    controller: 'DraftingController'
});
