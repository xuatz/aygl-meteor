DraftingController = RouteController.extend({
    layoutTemplate: 'draftinglayout'
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
