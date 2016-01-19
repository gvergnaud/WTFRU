'use strict';

angular.module('directives.selectable', [])
    .directive('selectable', function() {

        return {

            restrict: 'A',

            link: function(scope, element, attrs) {

                element.on('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    if (element[0].classList.contains('selected')) {
                        element[0].classList.remove('selected');
                    } else {
                        angular.forEach(element.parent()[0].querySelectorAll('.selected'), function(selectedElement) {
                            selectedElement.classList.remove('selected');
                        });

                        element[0].classList.add('selected');
                    }
                })
            }
        }
    });
