'use strict';

angular.module('directives.about', [])
    .directive('about', function() {

        return {

            restrict: 'A',

            link: function(scope, element, attrs) {

                element = $('#copyrights span.about');

                element.on('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var aboutPage = jQuery("#aboutPage");

                    aboutPage.on("click", function(e) {
                        // aboutPage[0].classList.remove('opened');
                        aboutPage.fadeOut();
                    });

                    if (aboutPage[0].classList.contains('opened')) {
                        // aboutPage[0].classList.remove('opened');
                    } else {
                        // aboutPage[0].classList.add('opened');
                        aboutPage.fadeIn();
                    }
                });
            }
        }
    });