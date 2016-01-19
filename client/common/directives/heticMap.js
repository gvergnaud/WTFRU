'use strict';

angular.module('directives.heticMap', [
    'ui.router'
])
    .directive('heticMap', function($state) {

        return {

            type: 'svg',

            restrict: 'E',

            scope: {
                etage: '=',
                places: '='
            },

            templateUrl: 'client/app/map/_map.html',

            transclude: true,

            link: function(scope, element, attrs) {

                scope.go = function(placeName) {
                    if (element[0].querySelector('svg#map').classList.contains('noclick')) {
                        element[0].querySelector('svg#map').classList.remove('noclick');
                    } else {
                        $state.go('map.place', {
                            placeName: placeName
                        });
                    }
                };
            }
        }
    })
    .directive('ngR', function() {

        return {

            restrict: 'A',

            scope: {
                ngR: '='
            },

            link: function(scope, element, attrs) {
                scope.$watch('ngR', function(newValue) {
                    if (newValue) {
                        newValue = newValue > 25 ? 25 : newValue;
                        newValue = newValue < 4 ? 4 : newValue;
                        element[0].setAttribute('r', newValue);
                    } else {
                        element[0].setAttribute('r', 0);
                    }
                });
            }
        }
    })
    .directive('staggerEnter', function() {

        return {

            restrict: 'A',

            link: function(scope, element, attrs) {
                var tl = new TimelineLite();
                tl
                    .staggerFrom(element[0].querySelectorAll('polygon'), .3, {
                        scale: 0,
                        x: '50%',
                        y: '50%'
                    }, .05)
                    .staggerFrom(element[0].querySelectorAll('g'), .3, {
                        scale: 0,
                        x: '50%',
                        y: '50%'
                    }, .07);
            }
        }
    });
