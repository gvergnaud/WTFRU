'use strict';

angular.module('WTFRU.map.place', [
    'ui.router',
    'filters.byHetic',
    'services.Place'
])
    .config(function($stateProvider) {

        $stateProvider
            .state('map.place', {
                url: '/place/:placeName',
                views: {
                    'place': {
                        templateUrl: 'client/app/map/place/place.html',
                        controller: 'placeCtrl',
                    }
                }
            });
    })
    .controller('placeCtrl', function($scope, $rootScope, $stateParams, $filter, Place) {

        Place.get($stateParams.placeName).then(function(place) {
            $scope.place = place;

            $scope.place.name = $stateParams.placeName;

            $scope.place.visibleUsers = $filter('byHetic')(place.users);
        });
    });