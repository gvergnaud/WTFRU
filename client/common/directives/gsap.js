'use strict';

angular.module('directives.gsap', [])
    .directive('scaleEnter', function() {

        return {

            restrict: 'A',

            link: function(scope, element, attrs) {

                TweenLite.from(element, .25, {
                    scale: .7,
                    autoAlpha: 0,
                    x: '10%',
                    y: '10%',
                    ease: Circ.easeInOut
                });

            }
        }
    })
    .directive('screenEnter', function() {

        return {

            restrict: 'A',

            link: function(scope, element, attrs) {

                TweenLite.from(element, .3, {
                    scale: 3,
                    autoAlpha: 0,
                    ease: Circ.easeOut
                });

            }
        }
    })
    .directive('rightEnter', function() {

        return {

            restrict: 'A',

            link: function(scope, element, attrs) {

                TweenLite.from(element, .25, {
                    x: '200%',
                    ease: Circ.easeInOut
                });

            }
        }
    })
    .directive('leftEnter', function() {

        return {

            restrict: 'A',

            link: function(scope, element, attrs) {

                TweenLite.from(element, .25, {
                    x: '-100%',
                    ease: Circ.easeInOut
                });

            }
        }
    });