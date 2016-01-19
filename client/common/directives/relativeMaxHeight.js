'use strict';

angular.module('directives.relativeMaxHeight', [])
	
	.directive('relativeMaxHeight', function(){

        return {

            restrict: 'A',

            link: function(scope, element, attrs){

                var style = function(){
                    element[0].style.maxHeight = window.innerHeight - attrs.relativeMaxHeight + 'px';
                };

                style();
                window.addEventListener('resize', style);                

            }
        }
    });