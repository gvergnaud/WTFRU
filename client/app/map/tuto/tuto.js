'use strict';

angular.module('WTFRU.map.tuto', [
    'ui.router',
    'directives.slide'
])
    .config(function ($stateProvider) {

        $stateProvider
            .state('map.tuto', {
                url: '/tuto',
                views: {
                    tuto: {
                        templateUrl: 'client/app/map/tuto/tuto.html',
                        controller: 'tutoCtrl',
                    }
                }
            });

    })
    .controller('tutoCtrl', function ($scope, $rootScope) {
         var cont = jQuery("#tutoContainer");
         cont.fadeIn();
    });