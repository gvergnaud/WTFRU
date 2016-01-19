'use strict';

angular.module('directives.onClickToggleClass', [])
	
	.directive('onClickToggleClass', function(){

        return {

            restrict: 'A',

            scope: {
            	className: '@onClickToggleClass'
            },

            link: function(scope, element, attrs){

            	element.on('click', function(){
                	element[0].classList.toggle(scope.className);
            	});

            }
        }
    });