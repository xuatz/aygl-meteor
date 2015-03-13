/*
======================================================================================================
What is this file for?

This file is loaded before ANY OTHER files in this directory (even before client/server). Therefore,
any code/variables which need to be declared and later used by client/server can be located here.
======================================================================================================
*/

/*
======================================================================================================
MongoDB Collections
Below are the MongoDB Collections which will be used by this app.
======================================================================================================
*/

VerifyTab = new Mongo.Collection('vtab');
Games = new Mongo.Collection('games');
Alerts = new Mongo.Collection('alerts');

/*
======================================================================================================
Bootstrap Notify
Below are the Alerts which will be used by this app.
======================================================================================================
*/

shownotification = function(name) {
    le_notify = $.notify({
        message: "Your challenge has been accepted!",
        title: '<strong>Yay, ' + name + '!</strong>',
        icon: 'fa fa-users fa-3x'
    }, {
        animate: {
            enter: "animated fadeInUp",
            exit: "animated zoomOutDown"
        },
        placement: {
            from: "top",
            align: "center"
        },
        type: 'info',
        allow_dismiss: false,
        delay:0,
        offset: {
            y: 150
        },
        template: '<div data-notify="container" class="col-xs-4 alert alert-{0}" role="alert">' +
            '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
            '<span data-notify="icon"></span> ' +
            '<span data-notify="title">{1}</span> ' +
            '<span data-notify="message">{2}</span>' +
            '<div class="row toppadding">'+
            '<div class="col-xs-6">'+
            '<button class="btn btn-success btn-block">Accept</button>'+
            '</div><div class="col-xs-6">'+
            '<button class="btn btn-danger btn-block">Reject</button>'+
            '</div></div>'+
            '<a href="{3}" target="{4}" data-notify="url"></a>' +
            '</div>'
    });
}
