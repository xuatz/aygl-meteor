HomeController = RouteController.extend({
    layoutTemplate: 'draftingLayout'
});

Router.route('/drafting', function() {
    this.render('draftingselected', {
        to: "selected"
    });
    this.next()
}, {
    name: 'drafting',
    controller: 'DraftingController'
});
