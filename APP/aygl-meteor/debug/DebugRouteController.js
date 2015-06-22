/*THIS FILE WILL MIMIC THE MODULE THAT THE ROUTER IS ROUTING FOR*/

Router.route('/pagebuilder', function() {
    this.render('pagebuilderlayout', {
        to: 'playmaincontent'
    });
}, {
    name: 'test',
    controller: 'PlayController'
});