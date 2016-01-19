'use strict';

angular.module('directives.svgPanZoom', [])
	
	.directive('svgPanZoom', function(){

        var count = 0;

        return {

            restrict: 'A',

            link: function(scope, element, attrs){
            	svgPanZoom(element[0], {
					zoomScaleSensitivity: 0.07,
					minZoom: 0.7,
					maxZoom: 10,
                    beforePan: function(){
                        count += 1;
                        // marqueur pour éviter que le click soit trigger au keyup du pan
                        if(count > 15 && !element[0].classList.contains('noclick')){
                            element[0].classList.add('noclick');
                        }
                    }
				});

                element.on('click', function(){
                    count = 0;
                    element[0].classList.remove('noclick');
                });
            }
        }
    });